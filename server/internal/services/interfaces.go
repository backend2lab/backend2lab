package services

import "github.com/backend2lab/backend2lab/server/internal/models"

// TestRunnerInterface defines the interface for running tests and code
type TestRunnerInterface interface {
	RunCode(moduleId, inputCode string) (*models.RunResult, error)
	RunTests(moduleId, inputCode string) (*models.TestSuiteResult, error)
}

// ModuleServiceInterface defines the interface for module operations
type ModuleServiceInterface interface {
	GetAllModules() ([]models.Module, error)
	GetModuleById(moduleId string) (*models.Module, error)
	GetModuleContent(moduleId string) (*models.ModuleContent, error)
	GetAvailableModules() ([]map[string]string, error)
}
