package services

import (
	"backend-playground-server/internal/models"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
)

// safeJoin joins baseDir and rel, ensuring the result is within baseDir (prevents path traversal)
func safeJoin(baseDir, rel string) (string, error) {
	absBase, err := filepath.Abs(baseDir)
	if err != nil {
		return "", fmt.Errorf("failed to resolve base dir: %w", err)
	}
	absPath := filepath.Join(absBase, rel)
	absPath, err = filepath.Abs(absPath)
	if err != nil {
		return "", fmt.Errorf("failed to resolve abs path: %w", err)
	}
	if !strings.HasPrefix(absPath, absBase+string(os.PathSeparator)) && absPath != absBase {
		return "", fmt.Errorf("path traversal detected: %s", rel)
	}
	return absPath, nil
}
	"backend-playground-server/internal/models"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
)

type ModuleService struct {
	modulesPath string
}

func NewModuleService() *ModuleService {
	// Use the modules directory from the current working directory
	modulesPath := filepath.Join("src", "modules")
	return &ModuleService{
		modulesPath: modulesPath,
	}
}

// NewModuleServiceWithPath creates a module service with a custom path (for testing)
func NewModuleServiceWithPath(modulesPath string) *ModuleService {
	return &ModuleService{
		modulesPath: modulesPath,
	}
}

// GetAllModules returns all available modules sorted by module number
func (s *ModuleService) GetAllModules() ([]models.Module, error) {
	var modules []models.Module

	// Read the modules directory
	entries, err := os.ReadDir(s.modulesPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read modules directory: %w", err)
	}

	// Filter and sort module directories
	var moduleDirs []fs.DirEntry
	for _, entry := range entries {
		if entry.IsDir() && strings.HasPrefix(entry.Name(), "module-") {
			moduleDirs = append(moduleDirs, entry)
		}
	}

	// Sort by module number
	sort.Slice(moduleDirs, func(i, j int) bool {
		partsI := strings.Split(moduleDirs[i].Name(), "-")
		partsJ := strings.Split(moduleDirs[j].Name(), "-")
		numI, errI := -1, error(nil)
		numJ, errJ := -1, error(nil)
		if len(partsI) > 1 {
			numI, errI = strconv.Atoi(partsI[1])
		}
		if len(partsJ) > 1 {
			numJ, errJ = strconv.Atoi(partsJ[1])
		}
		if errI != nil && errJ != nil {
			return moduleDirs[i].Name() < moduleDirs[j].Name()
		}
		if errI != nil {
			return false
		}
		if errJ != nil {
			return true
		}
		if numI == numJ {
			return moduleDirs[i].Name() < moduleDirs[j].Name()
		}
		return numI < numJ
	})

	// Load each module
	for _, moduleDir := range moduleDirs {
		moduleConfigPath := filepath.Join(s.modulesPath, moduleDir.Name(), "module.json")
		
		moduleData, err := os.ReadFile(moduleConfigPath)
		if err != nil {
			logrus.Errorf("Error loading module %s: %v", moduleDir.Name(), err)
			continue
		}

		var module models.Module
		if err := json.Unmarshal(moduleData, &module); err != nil {
			logrus.Errorf("Error parsing module %s: %v", moduleDir.Name(), err)
			continue
		}

		modules = append(modules, module)
	}

	return modules, nil
}

// GetModuleById returns a specific module by ID
func (s *ModuleService) GetModuleById(moduleId string) (*models.Module, error) {
	modules, err := s.GetAllModules()
	if err != nil {
		return nil, err
	}

	for _, module := range modules {
		if module.ID == moduleId {
			return &module, nil
		}
	}

	return nil, fmt.Errorf("module %s not found", moduleId)
}

// GetModuleContent returns the full content of a module including file contents
func (s *ModuleService) GetModuleContent(moduleId string) (*models.ModuleContent, error) {
	module, err := s.GetModuleById(moduleId)
	if err != nil {
		return nil, err
	}

	modulePath := filepath.Join(s.modulesPath, moduleId)

	// Read lab content
	var labContent string
	if module.Files.Lab.Readme != nil {
		labReadmePath := filepath.Join(modulePath, *module.Files.Lab.Readme)
		if content, err := os.ReadFile(labReadmePath); err == nil {
			labContent = string(content)
		}
	}

	// Read exercise content
	var exerciseContent models.ExerciseContent

	// Read exercise README
	if module.Files.Exercise.Readme != nil {
		exerciseReadmePath := filepath.Join(modulePath, *module.Files.Exercise.Readme)
		if content, err := os.ReadFile(exerciseReadmePath); err == nil {
			exerciseContent.Readme = string(content)
		}
	}

	// Read exercise server file
	if module.Files.Exercise.Server != nil {
		exerciseServerPath := filepath.Join(modulePath, *module.Files.Exercise.Server)
		if content, err := os.ReadFile(exerciseServerPath); err == nil {
			exerciseContent.EditorFiles.Server = string(content)
		}
	}

	// Read exercise test file
	if module.Files.Exercise.Test != nil {
		exerciseTestPath := filepath.Join(modulePath, *module.Files.Exercise.Test)
		if content, err := os.ReadFile(exerciseTestPath); err == nil {
			exerciseContent.EditorFiles.Test = string(content)
		}
	}

	// Read exercise package file
	if module.Files.Exercise.Package != nil {
		exercisePackagePath := filepath.Join(modulePath, *module.Files.Exercise.Package)
		if content, err := os.ReadFile(exercisePackagePath); err == nil {
			exerciseContent.EditorFiles.Package = string(content)
		}
	}

	// Read exercise solution
	if module.Files.Exercise.Solution != nil {
		exerciseSolutionPath := filepath.Join(modulePath, *module.Files.Exercise.Solution)
		if content, err := os.ReadFile(exerciseSolutionPath); err == nil {
			exerciseContent.Solution = string(content)
		}
	}

	return &models.ModuleContent{
		Module:          *module,
		LabContent:      labContent,
		ExerciseContent: exerciseContent,
	}, nil
}

// GetAvailableModules returns a simplified list of modules
func (s *ModuleService) GetAvailableModules() ([]map[string]string, error) {
	modules, err := s.GetAllModules()
	if err != nil {
		return nil, err
	}

	var availableModules []map[string]string
	for _, module := range modules {
		availableModules = append(availableModules, map[string]string{
			"id":         module.ID,
			"title":      module.Title,
			"difficulty": module.Difficulty,
		})
	}

	return availableModules, nil
}
