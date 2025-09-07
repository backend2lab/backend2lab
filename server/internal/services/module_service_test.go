package services

import (
	"os"
	"path/filepath"
	"testing"
)

func TestModuleService_GetAllModules(t *testing.T) {
	// Create a temporary directory structure for testing
	tempDir := t.TempDir()
	modulesDir := filepath.Join(tempDir, "modules")
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
	
	service := NewModuleServiceWithPath(modulesDir)
	
	modules, err := service.GetAllModules()
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	
	if len(modules) == 0 {
		t.Fatal("Expected at least one module, got none")
	}
	
	if modules[0].ID != "module-1" {
		t.Errorf("Expected module ID 'module-1', got '%s'", modules[0].ID)
	}
}

func TestModuleService_GetModuleById(t *testing.T) {
	// Create a temporary directory structure for testing
	tempDir := t.TempDir()
	modulesDir := filepath.Join(tempDir, "modules")
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
	
	service := NewModuleServiceWithPath(modulesDir)
	
	// Test existing module
	module, err := service.GetModuleById("module-1")
	if err != nil {
		t.Fatalf("Expected no error for module-1, got %v", err)
	}
	
	if module.ID != "module-1" {
		t.Errorf("Expected module ID 'module-1', got '%s'", module.ID)
	}
	
	// Test non-existing module
	_, err = service.GetModuleById("non-existing")
	if err == nil {
		t.Fatal("Expected error for non-existing module, got nil")
	}
}

func TestModuleService_GetModuleContent(t *testing.T) {
	// Create a temporary directory structure for testing
	tempDir := t.TempDir()
	modulesDir := filepath.Join(tempDir, "modules")
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
	
	service := NewModuleServiceWithPath(modulesDir)
	
	content, err := service.GetModuleContent("module-1")
	if err != nil {
		t.Fatalf("Expected no error for module-1 content, got %v", err)
	}
	
	if content.Module.ID != "module-1" {
		t.Errorf("Expected module ID 'module-1', got '%s'", content.Module.ID)
	}
	
	// Check that exercise content is loaded
	if content.ExerciseContent.EditorFiles.Server == "" {
		t.Error("Expected server file content, got empty string")
	}
	
	if content.ExerciseContent.EditorFiles.Test == "" {
		t.Error("Expected test file content, got empty string")
	}
}
