package services

import (
	"path/filepath"

	"github.com/backend2lab/backend2lab/server/internal/models"

	"github.com/sirupsen/logrus"
)

type TestRunner struct {
	modulesPath  string
	dockerRunner *DockerRunner
}

// NewTestRunner creates a new TestRunner instance
func NewTestRunner() *TestRunner {
	modulesPath := filepath.Join("src", "modules")
	
	// Initialize Docker runner - this is now required
	logrus.Infof("Initializing Docker runner...")
	dockerRunner, err := NewDockerRunner()
	if err != nil {
		logrus.Fatalf("Failed to initialize Docker runner: %v", err)
	}
	logrus.Infof("Docker runner initialized successfully")
	
	return &TestRunner{
		modulesPath:  modulesPath,
		dockerRunner: dockerRunner,
	}
}


// RunCode executes the provided code for a module using Docker
func (t *TestRunner) RunCode(moduleId, inputCode string) (*models.RunResult, error) {
	logrus.Infof("Running code for module %s using Docker", moduleId)
	return t.dockerRunner.RunCode(moduleId, inputCode)
}

// RunTests executes tests for the provided code using Docker
func (t *TestRunner) RunTests(moduleId, inputCode string) (*models.TestSuiteResult, error) {
	logrus.Infof("Running tests for module %s using Docker", moduleId)
	return t.dockerRunner.RunTests(moduleId, inputCode)
}
