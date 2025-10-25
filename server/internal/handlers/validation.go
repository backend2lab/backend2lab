package handlers

import "regexp"

// ValidateModuleId validates that moduleId is safe for filesystem operations
func ValidateModuleId(moduleId string) bool {
	// Expected format: module-number or module-number-language (e.g., module-1, module-1-js, module-1-python, etc.)
	// This prevents path traversal attacks and ensures only valid module IDs are accepted
	pattern := `^module-\d+(-(js|python))?$`
	matched, err := regexp.MatchString(pattern, moduleId)
	return err == nil && matched
}
