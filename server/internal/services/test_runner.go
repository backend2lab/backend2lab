package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"time"

	"github.com/backend2lab/backend2lab/server/internal/models"

	"github.com/sirupsen/logrus"
)

type TestRunner struct {
	modulesPath string
	httpClient  *http.Client
	dockerRunner *DockerRunner
}

// NewTestRunner creates a new TestRunner instance
func NewTestRunner() *TestRunner {
	modulesPath := filepath.Join("src", "modules")
	
	// Initialize Docker runner
	dockerRunner, err := NewDockerRunner()
	if err != nil {
		logrus.Warnf("Failed to initialize Docker runner, falling back to direct execution: %v", err)
		dockerRunner = nil
	}
	
	return &TestRunner{
		modulesPath: modulesPath,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
		dockerRunner: dockerRunner,
	}
}


// RunCode executes the provided code for a module
func (t *TestRunner) RunCode(moduleId, inputCode string) (*models.RunResult, error) {
	startTime := time.Now()

	if moduleId == "module-1" {
		return t.runModule1Code(moduleId, inputCode, startTime)
	}

	return t.runServerCode(moduleId, inputCode, startTime)
	// return nil, fmt.Errorf("Docker runner not available and direct execution not implemented for module: %s", moduleId)
}

// RunTests executes tests for the provided code
func (t *TestRunner) RunTests(moduleId, inputCode string) (*models.TestSuiteResult, error) {
	startTime := time.Now()

	if moduleId == "module-1" {
		return t.runModule1Tests(moduleId, inputCode, startTime)
	}
	return t.runServerTests(moduleId, inputCode, startTime)
	// return nil, fmt.Errorf("Docker runner not available and direct execution not implemented for module: %s", moduleId)
}

// runModule1Code executes function-based code for module-1
func (t *TestRunner) runModule1Code(moduleId, inputCode string, startTime time.Time) (*models.RunResult, error) {
	modulePath := filepath.Join(t.modulesPath, moduleId)
	mainFilePath := filepath.Join(modulePath, "exercise", "tmp-server.js")

	// Check if module exists
	if _, err := os.Stat(modulePath); os.IsNotExist(err) {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       fmt.Sprintf("Module %s not found", moduleId),
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "function",
		}, nil
	}

	// Write input code to tmp-server.js
	if err := os.WriteFile(mainFilePath, []byte(inputCode), 0644); err != nil {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Failed to write code to file",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &[]string{err.Error()}[0],
			ExerciseType:  "function",
		}, nil
	}

	// Execute the code
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "node", "tmp-server.js")
	cmd.Dir = filepath.Join(modulePath, "exercise")

	output, err := cmd.CombinedOutput()
	outputStr := strings.TrimSpace(string(output))

	if err != nil {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Code execution failed",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &outputStr,
			ExerciseType:  "function",
		}, nil
	}

	return &models.RunResult{
		ModuleID:      moduleId,
		Success:       true,
		Message:       "Code executed successfully",
		ExecutionTime: time.Since(startTime).Milliseconds(),
		Output:        &outputStr,
		ExerciseType:  "function",
	}, nil
}

// runModule1Tests runs tests for module-1
func (t *TestRunner) runModule1Tests(moduleId, inputCode string, startTime time.Time) (*models.TestSuiteResult, error) {
	modulePath := filepath.Join(t.modulesPath, moduleId)
	mainFilePath := filepath.Join(modulePath, "exercise", "tmp-server.js")

	// Check if module exists
	if _, err := os.Stat(modulePath); os.IsNotExist(err) {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Module Setup", Passed: false, Error: &[]string{fmt.Sprintf("Module %s not found", moduleId)}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "function",
		}, nil
	}

	// Write input code to tmp-server.js
	if err := os.WriteFile(mainFilePath, []byte(inputCode), 0644); err != nil {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Function Setup", Passed: false, Error: &[]string{fmt.Sprintf("Function setup failed: %s", err.Error())}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "function",
		}, nil
	}

	// Run tests using mocha
	testPath := filepath.Join(modulePath, "exercise", "test.js")
	cmd := exec.Command("npx", "mocha", testPath, "--reporter", "json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cmd = exec.CommandContext(ctx, cmd.Path, cmd.Args...)

	output, err := cmd.CombinedOutput()
	outputStr := string(output)

	var results []models.TestResult
	if err != nil {
		// Try to parse output even if command failed
		if mochaOutput, parseErr := t.parseMochaOutput(outputStr); parseErr == nil {
			results = t.convertMochaResults(mochaOutput)
		} else {
			results = []models.TestResult{{
				TestName: "Test Execution",
				Passed:   false,
				Error:    &[]string{fmt.Sprintf("Test execution failed: %s", err.Error())}[0],
			}}
		}
	} else {
		if mochaOutput, parseErr := t.parseMochaOutput(outputStr); parseErr == nil {
			results = t.convertMochaResults(mochaOutput)
		} else {
			results = []models.TestResult{{
				TestName: "Test Execution",
				Passed:   false,
				Error:    &[]string{fmt.Sprintf("Failed to parse test results: %s", parseErr.Error())}[0],
			}}
		}
	}

	passedTests := 0
	failedTests := 0
	for _, result := range results {
		if result.Passed {
			passedTests++
		} else {
			failedTests++
		}
	}

	return &models.TestSuiteResult{
		ModuleID:      moduleId,
		TotalTests:    len(results),
		PassedTests:   passedTests,
		FailedTests:   failedTests,
		Results:       results,
		ExecutionTime: time.Since(startTime).Milliseconds(),
		ExerciseType:  "function",
	}, nil
}

// runServerCode starts a server with the provided code
func (t *TestRunner) runServerCode(moduleId, inputCode string, startTime time.Time) (*models.RunResult, error) {
	modulePath := filepath.Join(t.modulesPath, moduleId)
	mainFilePath := filepath.Join(modulePath, "exercise", "tmp-server.js")

	// Check if module exists
	if _, err := os.Stat(modulePath); os.IsNotExist(err) {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       fmt.Sprintf("Module %s not found", moduleId),
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "server",
		}, nil
	}

	// Kill any existing processes on port 3000
	if err := t.killProcessOnPort(3000); err != nil {
		logrus.Warnf("Failed to kill process on port 3000: %v", err)
	}

	// Write input code to tmp-server.js
	if err := os.WriteFile(mainFilePath, []byte(inputCode), 0644); err != nil {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Failed to write code to file",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &[]string{err.Error()}[0],
			ExerciseType:  "server",
		}, nil
	}

	// Start the server
	cmd := exec.Command("node", "tmp-server.js")
	cmd.Dir = filepath.Join(modulePath, "exercise")

	// Capture server output
	var serverOutput bytes.Buffer
	cmd.Stdout = &serverOutput
	cmd.Stderr = &serverOutput

	// Start the process
	if err := cmd.Start(); err != nil {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Failed to start server",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &[]string{err.Error()}[0],
			ExerciseType:  "server",
		}, nil
	}

	// Ensure cleanup
	defer func() {
		if cmd.Process != nil {
			cmd.Process.Kill()
			cmd.Process.Wait()
		}
	}()

	// Wait for server to start with better detection
	serverStarted := false
	for i := 0; i < 10; i++ {
		time.Sleep(500 * time.Millisecond)
		
		// Check if server is responding
		resp, err := t.httpClient.Get("http://localhost:3000/")
		if err == nil {
			resp.Body.Close()
			serverStarted = true
			break
		}
	}

	if serverStarted {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       true,
			Message:       "Server started successfully",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Output:        &[]string{serverOutput.String()}[0],
			ExerciseType:  "server",
		}, nil
	} else {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Server startup timeout",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &[]string{fmt.Sprintf("Server failed to start. Output: %s", serverOutput.String())}[0],
			ExerciseType:  "server",
		}, nil
	}
}

// runServerTests runs tests for server-based modules
func (t *TestRunner) runServerTests(moduleId, inputCode string, startTime time.Time) (*models.TestSuiteResult, error) {
	modulePath := filepath.Join(t.modulesPath, moduleId)
	mainFilePath := filepath.Join(modulePath, "exercise", "tmp-server.js")

	// Check if module exists
	if _, err := os.Stat(modulePath); os.IsNotExist(err) {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Module Setup", Passed: false, Error: &[]string{fmt.Sprintf("Module %s not found", moduleId)}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "server",
		}, nil
	}

	// Kill any existing processes on port 3000
	if err := t.killProcessOnPort(3000); err != nil {
		logrus.Warnf("Failed to kill process on port 3000: %v", err)
	}

	// Write input code to tmp-server.js
	if err := os.WriteFile(mainFilePath, []byte(inputCode), 0644); err != nil {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Server Setup", Passed: false, Error: &[]string{fmt.Sprintf("Server setup failed: %s", err.Error())}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "server",
		}, nil
	}

	// Start the server in background
	cmd := exec.Command("node", "tmp-server.js")
	cmd.Dir = filepath.Join(modulePath, "exercise")

	// Capture server output for debugging
	var serverOutput bytes.Buffer
	cmd.Stdout = &serverOutput
	cmd.Stderr = &serverOutput

	if err := cmd.Start(); err != nil {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Server Setup", Passed: false, Error: &[]string{fmt.Sprintf("Server setup failed: %s", err.Error())}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "server",
		}, nil
	}

	// Ensure cleanup
	defer func() {
		if cmd.Process != nil {
			cmd.Process.Kill()
			cmd.Process.Wait() // Wait for process to actually terminate
		}
	}()

	// Wait for server to start with better detection
	serverStarted := false
	for i := 0; i < 10; i++ {
		time.Sleep(500 * time.Millisecond)
		
		// Check if server is responding
		resp, err := t.httpClient.Get("http://localhost:3000/")
		if err == nil {
			resp.Body.Close()
			serverStarted = true
			break
		}
	}

	if !serverStarted {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Server Startup", Passed: false, Error: &[]string{fmt.Sprintf("Server failed to start. Output: %s", serverOutput.String())}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
			ExerciseType:  "server",
		}, nil
	}

	// Run tests using mocha
	testPath := filepath.Join(modulePath, "exercise", "test.js")
	testCmd := exec.Command("npx", "mocha", testPath, "--reporter", "json")

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	testCmd = exec.CommandContext(ctx, testCmd.Path, testCmd.Args...)

	output, err := testCmd.CombinedOutput()
	outputStr := string(output)

	var results []models.TestResult
	if err != nil {
		// Try to parse output even if command failed
		if mochaOutput, parseErr := t.parseMochaOutput(outputStr); parseErr == nil {
			results = t.convertMochaResults(mochaOutput)
		} else {
			results = []models.TestResult{{
				TestName: "Test Execution",
				Passed:   false,
				Error:    &[]string{fmt.Sprintf("Test execution failed: %s\nOutput: %s", err.Error(), outputStr)}[0],
			}}
		}
	} else {
		if mochaOutput, parseErr := t.parseMochaOutput(outputStr); parseErr == nil {
			results = t.convertMochaResults(mochaOutput)
		} else {
			results = []models.TestResult{{
				TestName: "Test Execution",
				Passed:   false,
				Error:    &[]string{fmt.Sprintf("Failed to parse test results: %s\nOutput: %s", parseErr.Error(), outputStr)}[0],
			}}
		}
	}

	passedTests := 0
	failedTests := 0
	for _, result := range results {
		if result.Passed {
			passedTests++
		} else {
			failedTests++
		}
	}

	return &models.TestSuiteResult{
		ModuleID:      moduleId,
		TotalTests:    len(results),
		PassedTests:   passedTests,
		FailedTests:   failedTests,
		Results:       results,
		ExecutionTime: time.Since(startTime).Milliseconds(),
		ExerciseType:  "server",
	}, nil
}

// parseMochaOutput parses Mocha JSON output
func (t *TestRunner) parseMochaOutput(output string) (*models.MochaOutput, error) {
	var mochaOutput models.MochaOutput
	if err := json.Unmarshal([]byte(output), &mochaOutput); err != nil {
		return nil, err
	}
	return &mochaOutput, nil
}

// convertMochaResults converts Mocha results to our format
func (t *TestRunner) convertMochaResults(mochaOutput *models.MochaOutput) []models.TestResult {
	var results []models.TestResult

	// Handle passed tests
	for _, test := range mochaOutput.Passes {
		results = append(results, models.TestResult{
			TestName: test.Title,
			Passed:   true,
		})
	}

	// Handle failed tests
	for _, test := range mochaOutput.Failures {
		result := models.TestResult{
			TestName: test.Title,
			Passed:   false,
		}

		if test.Err != nil {
			errorMsg := test.Err.Message
			result.Error = &errorMsg

			// Try to extract expected/actual from error message
			expectedMatch := regexp.MustCompile(`expected\s+(.+?)\s+to`).FindStringSubmatch(errorMsg)
			actualMatch := regexp.MustCompile(`got\s+(.+?)$`).FindStringSubmatch(errorMsg)

			if len(expectedMatch) > 1 {
				result.Expected = expectedMatch[1]
			}
			if len(actualMatch) > 1 {
				result.Actual = actualMatch[1]
			}
		}

		results = append(results, result)
	}

	return results
}

// killProcessOnPort kills any process running on the specified port
func (t *TestRunner) killProcessOnPort(port int) error {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		// Find processes using the port
		findCmd := exec.Command("netstat", "-ano")
		output, err := findCmd.Output()
		if err != nil {
			return err
		}

		lines := strings.Split(string(output), "\n")
		for _, line := range lines {
			if strings.Contains(line, fmt.Sprintf(":%d", port)) {
				parts := strings.Fields(line)
				if len(parts) >= 5 {
					pid := parts[len(parts)-1]
					killCmd := exec.Command("taskkill", "/F", "/PID", pid)
					killCmd.Run() // Ignore errors
				}
			}
		}
	default:
		// Unix-like systems
		cmd = exec.Command("lsof", "-ti", fmt.Sprintf(":%d", port))
		output, err := cmd.Output()
		if err != nil {
			// No process found on port
			return nil
		}

		pids := strings.TrimSpace(string(output))
		if pids != "" {
			pidList := strings.Split(pids, "\n")
			for _, pid := range pidList {
				if pid != "" {
					killCmd := exec.Command("kill", "-9", pid)
					killCmd.Run() // Ignore errors
				}
			}
		}
	}

	return nil
}
