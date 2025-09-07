package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/backend2lab/backend2lab/server/internal/handlers"
	"github.com/backend2lab/backend2lab/server/internal/models"
	"github.com/backend2lab/backend2lab/server/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// mockTestRunner is a test double for TestRunnerInterface
type mockTestRunner struct{}

func (m *mockTestRunner) RunCode(moduleId, inputCode string) (*models.RunResult, error) {
	return &models.RunResult{
		ModuleID:      moduleId,
		Success:       true,
		Message:       "Code executed successfully",
		ExecutionTime: 100,
		Output:        &[]string{"Hello, World!"}[0],
		ExerciseType:  "function",
	}, nil
}

func (m *mockTestRunner) RunTests(moduleId, inputCode string) (*models.TestSuiteResult, error) {
	return &models.TestSuiteResult{
		ModuleID:      moduleId,
		TotalTests:    2,
		PassedTests:   2,
		FailedTests:   0,
		Results: []models.TestResult{
			{TestName: "Test 1", Passed: true},
			{TestName: "Test 2", Passed: true},
		},
		ExecutionTime: 200,
		ExerciseType:  "function",
	}, nil
}

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	
	// Create temporary modules directory
	tempDir := createTempModulesDir()
	
	// Initialize services with test doubles
	moduleService := services.NewModuleServiceWithPath(tempDir)
	testRunner := &mockTestRunner{}
	
	// Initialize handlers
	moduleHandler := handlers.NewModuleHandler(moduleService)
	testHandler := handlers.NewTestHandler(testRunner)
	
	// Setup router
	router := gin.New()
	
	// API routes
	api := router.Group("/api")
	{
		api.GET("/modules", moduleHandler.GetAllModules)
		api.GET("/modules/:moduleId", moduleHandler.GetModuleContent)
		api.POST("/test/:moduleId", testHandler.RunTests)
		api.POST("/run/:moduleId", testHandler.RunCode)
	}
	
	return router
}

// createTempModulesDir creates a temporary directory with test module data
func createTempModulesDir() string {
	tempDir := os.TempDir()
	modulesDir := filepath.Join(tempDir, "test-modules")
	module1Dir := filepath.Join(modulesDir, "module-1")
	
	// Create module-1 directory
	os.MkdirAll(module1Dir, 0755)
	
	// Create a test module.json
	moduleJSON := `{
		"id": "module-1",
		"title": "Test Module",
		"description": "A test module",
		"difficulty": "Beginner",
		"estimatedTime": "30 minutes",
		"tags": ["test"],
		"files": {
			"lab": {"readme": "lab/README.md"},
			"exercise": {
				"readme": "exercise/README.md",
				"server": "exercise/server.js",
				"test": "exercise/test.js",
				"solution": "exercise/solution.js",
				"package": "exercise/package.json"
			}
		},
		"learningObjectives": ["Learn testing"],
		"prerequisites": ["Basic knowledge"]
	}`
	
	os.WriteFile(filepath.Join(module1Dir, "module.json"), []byte(moduleJSON), 0644)
	
	// Create exercise directory and files
	exerciseDir := filepath.Join(module1Dir, "exercise")
	os.MkdirAll(exerciseDir, 0755)
	os.WriteFile(filepath.Join(exerciseDir, "README.md"), []byte("# Exercise"), 0644)
	os.WriteFile(filepath.Join(exerciseDir, "server.js"), []byte("// Server code"), 0644)
	os.WriteFile(filepath.Join(exerciseDir, "test.js"), []byte("// Test code"), 0644)
	os.WriteFile(filepath.Join(exerciseDir, "solution.js"), []byte("// Solution"), 0644)
	os.WriteFile(filepath.Join(exerciseDir, "package.json"), []byte("{}"), 0644)
	
	// Create lab directory and files
	labDir := filepath.Join(module1Dir, "lab")
	os.MkdirAll(labDir, 0755)
	os.WriteFile(filepath.Join(labDir, "README.md"), []byte("# Lab"), 0644)
	
	return modulesDir
}

func TestGetAllModules(t *testing.T) {
	router := setupTestRouter()
	
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/modules", nil)
	router.ServeHTTP(w, req)
	
	assert.Equal(t, http.StatusOK, w.Code)
	
	var modules []map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &modules)
	assert.NoError(t, err)
	assert.NotEmpty(t, modules)
}

func TestGetModuleContent(t *testing.T) {
	router := setupTestRouter()
	
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/modules/module-1", nil)
	router.ServeHTTP(w, req)
	
	assert.Equal(t, http.StatusOK, w.Code)
	
	var content map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &content)
	assert.NoError(t, err)
	assert.Contains(t, content, "module")
	assert.Contains(t, content, "exerciseContent")
}

func TestRunCode(t *testing.T) {
	router := setupTestRouter()
	
	requestBody := map[string]string{
		"code": "console.log('Hello, World!');",
	}
	jsonBody, _ := json.Marshal(requestBody)
	
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/run/module-1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)
	
	assert.Equal(t, http.StatusOK, w.Code)
	
	var result map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &result)
	assert.NoError(t, err)
	assert.Contains(t, result, "moduleId")
	assert.Contains(t, result, "success")
}

func TestRunTests(t *testing.T) {
	router := setupTestRouter()
	
	requestBody := map[string]string{
		"code": "module.exports = { greetUser: (name) => `Hello, ${name}! Welcome to Node.js!` };",
	}
	jsonBody, _ := json.Marshal(requestBody)
	
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/test/module-1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)
	
	assert.Equal(t, http.StatusOK, w.Code)
	
	var result map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &result)
	assert.NoError(t, err)
	assert.Contains(t, result, "moduleId")
	assert.Contains(t, result, "totalTests")
	assert.Contains(t, result, "results")
}
