package config

import (
	"os"
	"strconv"
)

// DockerConfig holds Docker-related configuration
type DockerConfig struct {
	Enabled           bool
	MemoryLimit       int64  // Memory limit in bytes
	CPULimit          int64  // CPU limit (quota/period)
	ExecutionTimeout  int    // Execution timeout in seconds
	NetworkDisabled   bool   // Disable network access
	ReadOnlyRootFS    bool   // Use read-only root filesystem
}

// LoadDockerConfig loads Docker configuration from environment variables
func LoadDockerConfig() *DockerConfig {
	config := &DockerConfig{
		Enabled:           getEnvBool("DOCKER_ENABLED", true),
		MemoryLimit:       getEnvInt64("DOCKER_MEMORY_LIMIT", 128*1024*1024), // 128MB default
		CPULimit:          getEnvInt64("DOCKER_CPU_LIMIT", 50000),             // 50% CPU default
		ExecutionTimeout:  getEnvInt("DOCKER_EXECUTION_TIMEOUT", 30),          // 30 seconds default
		NetworkDisabled:   getEnvBool("DOCKER_NETWORK_DISABLED", true),
		ReadOnlyRootFS:    getEnvBool("DOCKER_READONLY_ROOTFS", false),
	}

	return config
}

// getEnvBool gets a boolean environment variable with a default value
func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.ParseBool(value); err == nil {
			return parsed
		}
	}
	return defaultValue
}

// getEnvInt gets an integer environment variable with a default value
func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.Atoi(value); err == nil {
			return parsed
		}
	}
	return defaultValue
}

// getEnvInt64 gets an int64 environment variable with a default value
func getEnvInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.ParseInt(value, 10, 64); err == nil {
			return parsed
		}
	}
	return defaultValue
}

