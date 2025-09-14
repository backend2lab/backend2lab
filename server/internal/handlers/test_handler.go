package handlers

import (
	"net/http"

	"github.com/backend2lab/backend2lab/server/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type TestHandler struct {
	testRunner services.TestRunnerInterface
}

func NewTestHandler(testRunner services.TestRunnerInterface) *TestHandler {
	return &TestHandler{
		testRunner: testRunner,
	}
}

// RunTests executes tests for the provided code
func (h *TestHandler) RunTests(c *gin.Context) {
	moduleId := c.Param("moduleId")
	if moduleId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Module ID is required"})
		return
	}

	// Validate moduleId to prevent path traversal attacks
	if !ValidateModuleId(moduleId) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid module ID format"})
		return
	}

	var request struct {
		Code string `json:"code" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code is required"})
		return
	}

	testResult, err := h.testRunner.RunTests(moduleId, request.Code)
	if err != nil {
		logrus.Errorf("Test execution failed for module %s: %v", moduleId, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Test execution failed"})
		return
	}

	c.JSON(http.StatusOK, testResult)
}

// RunCode executes the provided code
func (h *TestHandler) RunCode(c *gin.Context) {
	moduleId := c.Param("moduleId")
	if moduleId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Module ID is required"})
		return
	}

	// Validate moduleId to prevent path traversal attacks
	if !ValidateModuleId(moduleId) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid module ID format"})
		return
	}

	var request struct {
		Code string `json:"code" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code is required"})
		return
	}

	runResult, err := h.testRunner.RunCode(moduleId, request.Code)
	if err != nil {
		logrus.Errorf("Code execution failed for module %s: %v", moduleId, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Code execution failed"})
		return
	}

	c.JSON(http.StatusOK, runResult)
}
