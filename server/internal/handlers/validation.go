package handlers

import "regexp"

// ValidateModuleId validates that moduleId is safe for filesystem operations
func ValidateModuleId(moduleId string) bool {
	// Expected format: module-number (e.g., module-1, module-2, etc.)
	// This prevents path traversal attacks and ensures only valid module IDs are accepted
	pattern := `^module-\d+$`
	matched, err := regexp.MatchString(pattern, moduleId)
	return err == nil && matched
}
