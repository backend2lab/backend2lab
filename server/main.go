package main

import (
	"log"
	"os"

	"github.com/backend2lab/backend2lab/server/internal/handlers"
	"github.com/backend2lab/backend2lab/server/internal/middleware"
	"github.com/backend2lab/backend2lab/server/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func main() {
	// Setup logging
	logrus.SetLevel(logrus.InfoLevel)
	logrus.SetFormatter(&logrus.JSONFormatter{})

	// Get configuration from environment
	host := getEnv("HOST", "localhost")
	port := getEnv("PORT", "4000")

	// Initialize services
	moduleService := services.NewModuleService()
	testRunner := services.NewTestRunner()

	// Initialize handlers
	moduleHandler := handlers.NewModuleHandler(moduleService)
	testHandler := handlers.NewTestHandler(testRunner)

	// Setup Gin router
	router := gin.New()
	
	// Add recovery middleware
	router.Use(gin.Recovery())

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"}
	router.Use(cors.New(config))

	// Request logging middleware
	router.Use(middleware.RequestLogger())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	// API routes
	api := router.Group("/api")
	{
		// Module routes
		api.GET("/modules", moduleHandler.GetAllModules)
		api.GET("/modules/:moduleId", moduleHandler.GetModuleContent)

		// Test routes
		api.POST("/test/:moduleId", testHandler.RunTests)
		api.POST("/run/:moduleId", testHandler.RunCode)
	}

	// Start server
	logrus.Infof("Backend2Lab Server starting on %s:%s", host, port)
	if err := router.Run(host + ":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
