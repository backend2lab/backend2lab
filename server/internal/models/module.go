package models

// ModuleFile represents the file structure for a module
type ModuleFile struct {
	Readme    *string `json:"readme,omitempty"`
	Server    *string `json:"server,omitempty"`
	Test      *string `json:"test,omitempty"`
	Solution  *string `json:"solution,omitempty"`
	Package   *string `json:"package,omitempty"`
}

// Module represents a learning module
type Module struct {
	ID                 string     `json:"id"`
	Title              string     `json:"title"`
	Description        string     `json:"description"`
	Difficulty         string     `json:"difficulty"`
	EstimatedTime      string     `json:"estimatedTime"`
	Tags               []string   `json:"tags"`
	Files              ModuleFiles `json:"files"`
	LearningObjectives []string   `json:"learningObjectives"`
	Prerequisites      []string   `json:"prerequisites"`
}

// ModuleFiles represents the file structure for lab and exercise
type ModuleFiles struct {
	Lab      ModuleFile `json:"lab"`
	Exercise ModuleFile `json:"exercise"`
}

// ModuleContent represents the full content of a module including file contents
type ModuleContent struct {
	Module         Module           `json:"module"`
	LabContent     string           `json:"labContent"`
	ExerciseContent ExerciseContent `json:"exerciseContent"`
}

// ExerciseContent represents the exercise content with file contents
type ExerciseContent struct {
	Readme      string      `json:"readme"`
	EditorFiles EditorFiles `json:"editorFiles"`
	Solution    string      `json:"solution"`
}

// EditorFiles represents the files shown in the editor
type EditorFiles struct {
	Server  string `json:"server"`
	Test    string `json:"test"`
	Package string `json:"package"`
}

// TestResult represents the result of a single test
type TestResult struct {
	TestName string      `json:"testName"`
	Passed   bool        `json:"passed"`
	Error    *string     `json:"error,omitempty"`
	Expected interface{} `json:"expected,omitempty"`
	Actual   interface{} `json:"actual,omitempty"`
}

// TestSuiteResult represents the result of running a test suite
type TestSuiteResult struct {
	ModuleID      string       `json:"moduleId"`
	TotalTests    int          `json:"totalTests"`
	PassedTests   int          `json:"passedTests"`
	FailedTests   int          `json:"failedTests"`
	Results       []TestResult `json:"results"`
	ExecutionTime int64        `json:"executionTime"`
	ExerciseType  string       `json:"exerciseType"`
}

// RunResult represents the result of running code
type RunResult struct {
	ModuleID      string  `json:"moduleId"`
	Success       bool    `json:"success"`
	Message       string  `json:"message"`
	ExecutionTime int64   `json:"executionTime"`
	Output        *string `json:"output,omitempty"`
	Error         *string `json:"error,omitempty"`
	ExerciseType  string  `json:"exerciseType"`
}

// MochaTestResult represents a test result from Mocha JSON reporter
type MochaTestResult struct {
	Title string `json:"title"`
	FullTitle string `json:"fullTitle"`
	Duration int `json:"duration"`
	State string `json:"state"`
	Err *MochaError `json:"err,omitempty"`
}

// MochaError represents an error from Mocha
type MochaError struct {
	Message string `json:"message"`
	Stack   string `json:"stack"`
}

// MochaOutput represents the complete Mocha JSON output
type MochaOutput struct {
	Stats MochaStats `json:"stats"`
	Tests []MochaTestResult `json:"tests"`
	Passes []MochaTestResult `json:"passes"`
	Failures []MochaTestResult `json:"failures"`
	Pending []MochaTestResult `json:"pending"`
}

// MochaStats represents Mocha statistics
type MochaStats struct {
	Suites   int `json:"suites"`
	Tests    int `json:"tests"`
	Passes   int `json:"passes"`
	Pending  int `json:"pending"`
	Failures int `json:"failures"`
	Start    string `json:"start"`
	End      string `json:"end"`
	Duration int `json:"duration"`
}
