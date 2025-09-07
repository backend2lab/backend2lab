package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend-playground-server/internal/handlers"
	"backend-playground-server/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	
	// Initialize services
	moduleService := services.NewModuleService()
	testRunner := services.NewTestRunner()
	
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
