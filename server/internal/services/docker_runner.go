package services

import (
	"archive/tar"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/backend2lab/backend2lab/server/config"
	"github.com/backend2lab/backend2lab/server/internal/models"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/sirupsen/logrus"
)

type DockerRunner struct {
	dockerClient *client.Client
	modulesPath  string
	config       *config.DockerConfig
}

// NewDockerRunner creates a new DockerRunner instance
func NewDockerRunner() (*DockerRunner, error) {
	dockerClient, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}

	modulesPath := filepath.Join("src", "modules")
	dockerConfig := config.LoadDockerConfig()
	
	return &DockerRunner{
		dockerClient: dockerClient,
		modulesPath:  modulesPath,
		config:       dockerConfig,
	}, nil
}

// RunCode executes the provided code in a Docker container
func (d *DockerRunner) RunCode(moduleId, inputCode string) (*models.RunResult, error) {
	startTime := time.Now()

	// Create a unique container name
	containerName := fmt.Sprintf("module-runner-%s-%d", moduleId, time.Now().UnixNano())

	// Build the container image
	imageName := fmt.Sprintf("module-runner:%s", moduleId)

	if err := d.buildModuleImage(moduleId, imageName); err != nil {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Failed to build module image",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &[]string{err.Error()}[0],
		}, nil
	}

	// Create container with user code
	containerID, err := d.createContainer(containerName, imageName, inputCode, moduleId)
	if err != nil {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Failed to create container",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &[]string{err.Error()}[0],
		}, nil
	}

	// Ensure cleanup
	defer d.cleanupContainer(containerID)

	// Start and run the container
	output, err := d.runContainer(containerID, time.Duration(d.config.ExecutionTimeout)*time.Second)
	if err != nil {
		return &models.RunResult{
			ModuleID:      moduleId,
			Success:       false,
			Message:       "Container execution failed",
			ExecutionTime: time.Since(startTime).Milliseconds(),
			Error:         &[]string{err.Error()}[0],
		}, nil
	}

	return &models.RunResult{
		ModuleID:      moduleId,
		Success:       true,
		Message:       "Code executed successfully",
		ExecutionTime: time.Since(startTime).Milliseconds(),
		Output:        &output,
	}, nil
}

// RunTests executes tests for the provided code in a Docker container
func (d *DockerRunner) RunTests(moduleId, inputCode string) (*models.TestSuiteResult, error) {
	startTime := time.Now()

	// Create a unique container name
	containerName := fmt.Sprintf("module-tester-%s-%d", moduleId, time.Now().UnixNano())

	// Build the container image
	imageName := fmt.Sprintf("module-test-runner:%s", moduleId)
	if err := d.buildModuleImage(moduleId, imageName); err != nil {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Setup", Passed: false, Error: &[]string{fmt.Sprintf("Failed to build module image: %s", err.Error())}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
		}, nil
	}

	// Create container with user code
	containerID, err := d.createTestContainer(containerName, imageName, inputCode, moduleId)

	if err != nil {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Setup", Passed: false, Error: &[]string{fmt.Sprintf("Failed to create container: %s", err.Error())}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
		}, nil
	}

	// Ensure cleanup
	defer d.cleanupContainer(containerID)

	// Start and run the container
	output, err := d.runContainer(containerID, time.Duration(d.config.ExecutionTimeout*2)*time.Second)

	if err != nil {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{{TestName: "Execution", Passed: false, Error: &[]string{fmt.Sprintf("Container execution failed: %s", err.Error())}[0]}},
			ExecutionTime: time.Since(startTime).Milliseconds(),
		}, nil
	}

	// Parse test results
	return d.parseTestResults(moduleId, output, time.Since(startTime))
}

// buildModuleImage builds a Docker image for the module
func (d *DockerRunner) buildModuleImage(moduleId, imageName string) error {
	modulePath := filepath.Join(d.modulesPath, moduleId, "exercise")
	
	// Check if module exists
	if _, err := os.Stat(modulePath); os.IsNotExist(err) {
		return fmt.Errorf("module %s not found", moduleId)
	}

	// Create build context
	buildContext, err := d.createBuildContext(modulePath)
	if err != nil {
		return fmt.Errorf("failed to create build context: %w", err)
	}

	// Build the image
	ctx := context.Background()
	buildOptions := types.ImageBuildOptions{
		Tags:       []string{imageName},
		Dockerfile: "Dockerfile",
		Context:    buildContext,
		Remove:     true,
	}

	// Add timeout context for build operation
	buildCtx, cancel := context.WithTimeout(ctx, 5*time.Minute)
	defer cancel()

	buildResponse, err := d.dockerClient.ImageBuild(buildCtx, buildContext, buildOptions)
	if err != nil {
		return fmt.Errorf("failed to build image: %w", err)
	}
	defer buildResponse.Body.Close()
	
	// Read build output with timeout
	done := make(chan error, 1)
	go func() {
		_, err := io.Copy(io.Discard, buildResponse.Body)
		done <- err
	}()
	
	select {
	case err := <-done:
		if err != nil {
			return fmt.Errorf("failed to read build output: %w", err)
		}
	case <-buildCtx.Done():
		return fmt.Errorf("build operation timed out: %w", buildCtx.Err())
	}

	return nil
}

// createBuildContext creates a tar archive for Docker build context
func (d *DockerRunner) createBuildContext(modulePath string) (io.Reader, error) {
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)

	// Add all files from module directory
	err := filepath.Walk(modulePath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories
		if info.IsDir() {
			return nil
		}

		// Skip large files and temporary files that might cause issues
		if info.Size() > 10*1024*1024 { // Skip files larger than 10MB
			fmt.Printf("Skipping large file: %s (size: %d bytes)\n", path, info.Size())
			return nil
		}

		// Skip common temporary and cache files
		fileName := filepath.Base(path)
		if fileName == "tmp-server.js" || fileName == ".DS_Store" || 
		   filepath.Ext(fileName) == ".log" || filepath.Ext(fileName) == ".tmp" {
			fmt.Printf("Skipping temporary file: %s\n", path)
			return nil
		}

		// Read file content
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		// Calculate relative path
		relPath, err := filepath.Rel(modulePath, path)
		if err != nil {
			return err
		}

		// Add file to tar
		header := &tar.Header{
			Name: relPath,
			Size: int64(len(content)),
			Mode: 0644,
		}

		if err := tw.WriteHeader(header); err != nil {
			return err
		}

		if _, err := tw.Write(content); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Add Dockerfile
	dockerfilePath := filepath.Join(d.modulesPath, "../..", "Dockerfile.module-runner")
	dockerfileContent, err := os.ReadFile(dockerfilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read Dockerfile: %w", err)
	}

	header := &tar.Header{
		Name: "Dockerfile",
		Size: int64(len(dockerfileContent)),
		Mode: 0644,
	}

	if err := tw.WriteHeader(header); err != nil {
		return nil, err
	}

	if _, err := tw.Write(dockerfileContent); err != nil {
		return nil, err
	}

	if err := tw.Close(); err != nil {
		return nil, err
	}

	return bytes.NewReader(buf.Bytes()), nil
}

// createContainer creates a Docker container for code execution
func (d *DockerRunner) createContainer(containerName, imageName, inputCode, moduleId string) (string, error) {
	ctx := context.Background()

	cmd := []string{"node", "tmp-server.js"}
	
	containerConfig := &container.Config{
		Image: imageName,
		Cmd:   cmd,
		Env: []string{
			"PORT=3000",
		},
		WorkingDir: "/app",
		User:       "1001:1001", // nodejs user
		// NetworkDisabled: d.config.NetworkDisabled, // Disable network access for security
	}

	// Create host config with resource limits from configuration
	hostConfig := &container.HostConfig{
		Resources: container.Resources{
			Memory:     d.config.MemoryLimit,
			MemorySwap: d.config.MemoryLimit, // No swap
			CPUQuota:   d.config.CPULimit,
			CPUPeriod:  100000,
		},
		AutoRemove: false, // Don't auto-remove, we'll handle cleanup manually
	}

	// Create network config
	networkConfig := &network.NetworkingConfig{}

	// Create container
	containerResp, err := d.dockerClient.ContainerCreate(ctx, containerConfig, hostConfig, networkConfig, nil, containerName)
	if err != nil {
		return "", fmt.Errorf("failed to create container: %w", err)
	}

	// Copy user code to container
	if err := d.copyCodeToContainer(containerResp.ID, inputCode); err != nil {
		d.dockerClient.ContainerRemove(ctx, containerResp.ID, container.RemoveOptions{Force: true})
		return "", fmt.Errorf("failed to copy code to container: %w", err)
	}

	return containerResp.ID, nil
}

// createTestContainer creates a Docker container for test execution
func (d *DockerRunner) createTestContainer(containerName, imageName, inputCode, moduleId string) (string, error) {
	ctx := context.Background()

	// Create container config for testing
	containerConfig := &container.Config{
		Image: imageName,
		Cmd:   []string{"sh", "-c", "echo 'Starting server...'; node tmp-server.js & SERVER_PID=$!; echo 'Server PID:' $SERVER_PID; sleep 3; echo 'Running tests...'; npm run test -- --reporter json; echo 'Stopping server...'; kill $SERVER_PID 2>/dev/null || true; echo 'Done'"},
		Env: []string{
			"PORT=3000",
		},
		WorkingDir: "/app",
		User:       "1001:1001", // nodejs user
		// NetworkDisabled: false, // Enable network for testing (needed for npm install, etc.)
	}

	// Create host config with resource limits from configuration
	hostConfig := &container.HostConfig{
		Resources: container.Resources{
			Memory:     d.config.MemoryLimit * 2, // Double memory for tests
			MemorySwap: d.config.MemoryLimit * 2, // No swap
			CPUQuota:   d.config.CPULimit,
			CPUPeriod:  100000,
		},
		AutoRemove: false, // Don't auto-remove, we'll handle cleanup manually
	}

	// Create network config
	networkConfig := &network.NetworkingConfig{}

	// Create container
	containerResp, err := d.dockerClient.ContainerCreate(ctx, containerConfig, hostConfig, networkConfig, nil, containerName)
	if err != nil {
		return "", fmt.Errorf("failed to create container: %w", err)
	}

	// Copy user code to container
	if err := d.copyCodeToContainer(containerResp.ID, inputCode); err != nil {
		d.dockerClient.ContainerRemove(ctx, containerResp.ID, container.RemoveOptions{Force: true})
		return "", fmt.Errorf("failed to copy code to container: %w", err)
	}

	return containerResp.ID, nil
}

// copyCodeToContainer copies user code to the container
func (d *DockerRunner) copyCodeToContainer(containerID, inputCode string) error {
	ctx := context.Background()

	// Create tar archive with user code
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)

	// Add user code as tmp-server.js
	header := &tar.Header{
		Name: "tmp-server.js",
		Size: int64(len(inputCode)),
		Mode: 0644,
	}

	if err := tw.WriteHeader(header); err != nil {
		return err
	}

	if _, err := tw.Write([]byte(inputCode)); err != nil {
		return err
	}

	if err := tw.Close(); err != nil {
		return err
	}

	// Copy to container
	err := d.dockerClient.CopyToContainer(ctx, containerID, "/app", &buf, types.CopyToContainerOptions{})
	if err != nil {
		return fmt.Errorf("failed to copy to container: %w", err)
	}
	
	return nil
}

// runContainer starts and runs the container, returning its output
func (d *DockerRunner) runContainer(containerID string, timeout time.Duration) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	// Start container
	if err := d.dockerClient.ContainerStart(ctx, containerID, container.StartOptions{}); err != nil {
		return "", fmt.Errorf("failed to start container: %w", err)
	}

	// Check container status
	inspect, err := d.dockerClient.ContainerInspect(ctx, containerID)
	if err != nil {
		fmt.Printf("Failed to inspect container: %v\n", err)
	} else {
		fmt.Printf("Container state: %+v\n", inspect.State)
		if !inspect.State.Running {
			return "", fmt.Errorf("container is not running, state: %s, error: %s", inspect.State.Status, inspect.State.Error)
		}
	}

	// Wait for container to finish
	statusCh, errCh := d.dockerClient.ContainerWait(ctx, containerID, container.WaitConditionNotRunning)

	select {
	case err := <-errCh:
		if err != nil {
			return "", fmt.Errorf("container wait error: %w", err)
		}
	case status := <-statusCh:
		fmt.Printf("Container finished with status: %+v\n", status)
		// Container finished
	case <-ctx.Done():
		return "", fmt.Errorf("container wait timed out: %w", ctx.Err())
	}

	// Get container logs
	logs, err := d.dockerClient.ContainerLogs(ctx, containerID, container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
	})
	if err != nil {
		return "", fmt.Errorf("failed to get container logs: %w", err)
	}
	defer logs.Close()

	// Read logs
	var output bytes.Buffer
	_, err = io.Copy(&output, logs)
	if err != nil {
		return "", fmt.Errorf("failed to read container logs: %w", err)
	}

	return strings.TrimSpace(output.String()), nil
}

// parseTestResults parses Mocha JSON output into TestSuiteResult
func (d *DockerRunner) parseTestResults(moduleId, output string, executionTime time.Duration) (*models.TestSuiteResult, error) {	
	// Handle empty output
	if strings.TrimSpace(output) == "" {
		return &models.TestSuiteResult{
			ModuleID:      moduleId,
			TotalTests:    0,
			PassedTests:   0,
			FailedTests:   0,
			Results:       []models.TestResult{},
			ExecutionTime: executionTime.Milliseconds(),
		}, nil
	}

	// Try to parse as JSON (Mocha JSON reporter) - same as non-Docker runner
	var mochaOutput models.MochaOutput
	if err := json.Unmarshal([]byte(output), &mochaOutput); err == nil {
		// Successfully parsed JSON - use same logic as non-Docker runner
		results := d.convertMochaResults(&mochaOutput)
		
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
			ExecutionTime: executionTime.Milliseconds(),
		}, nil
	}

	// Fallback: parse as text output (keep existing logic for backward compatibility)
	lines := strings.Split(output, "\n")
	var totalTests, passedTests, failedTests int
	
	for _, line := range lines {
		line = strings.TrimSpace(line)
		// Look for individual test results with checkmarks
		if strings.Contains(line, "✔") || strings.Contains(line, "✓") {
			passedTests++
			totalTests++
		} else if strings.Contains(line, "✗") || strings.Contains(line, "✖") {
			failedTests++
			totalTests++
		}
	}

	// If we didn't find individual test markers, look for summary lines
	if totalTests == 0 {
		for _, line := range lines {
			line = strings.TrimSpace(line)
			// Look for summary like "7 passing (123ms)" or "0 passing, 7 failing"
			if strings.Contains(line, "passing") && strings.Contains(line, "failing") {
				// Parse "X passing, Y failing" format
				re := regexp.MustCompile(`(\d+)\s+passing.*?(\d+)\s+failing`)
				matches := re.FindStringSubmatch(line)
				if len(matches) >= 3 {
					passedTests, _ = strconv.Atoi(matches[1])
					failedTests, _ = strconv.Atoi(matches[2])
					totalTests = passedTests + failedTests
				}
			} else if strings.Contains(line, "passing") && !strings.Contains(line, "failing") {
				// Parse "X passing (Yms)" format
				re := regexp.MustCompile(`(\d+)\s+passing`)
				matches := re.FindStringSubmatch(line)
				if len(matches) >= 2 {
					passedTests, _ = strconv.Atoi(matches[1])
					totalTests = passedTests
					failedTests = 0
				}
			}
		}
	}

	// Create a single result for the entire test suite
	var results []models.TestResult
	if totalTests > 0 {
		results = append(results, models.TestResult{
			TestName: "Test Suite",
			Passed:   failedTests == 0,
			Error:    &output,
		})
	}

	return &models.TestSuiteResult{
		ModuleID:      moduleId,
		TotalTests:    totalTests,
		PassedTests:   passedTests,
		FailedTests:   failedTests,
		Results:       results,
		ExecutionTime: executionTime.Milliseconds(),
	}, nil
}

// convertMochaResults converts Mocha results to our format (same as TestRunner)
func (d *DockerRunner) convertMochaResults(mochaOutput *models.MochaOutput) []models.TestResult {
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

// cleanupContainer removes the container
func (d *DockerRunner) cleanupContainer(containerID string) {
	ctx := context.Background()
	
	// Force remove container
	err := d.dockerClient.ContainerRemove(ctx, containerID, container.RemoveOptions{
		Force: true,
	})
	if err != nil {
		logrus.Warnf("Failed to remove container %s: %v", containerID, err)
	}
}
