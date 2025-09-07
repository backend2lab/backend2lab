package handlers

import (
	"backend-playground-server/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type ModuleHandler struct {
	moduleService *services.ModuleService
}

func NewModuleHandler(moduleService *services.ModuleService) *ModuleHandler {
	return &ModuleHandler{
		moduleService: moduleService,
	}
}

// GetAllModules returns all available modules
func (h *ModuleHandler) GetAllModules(c *gin.Context) {
	modules, err := h.moduleService.GetAllModules()
	if err != nil {
		logrus.Errorf("Failed to load modules: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load modules"})
		return
	}

	c.JSON(http.StatusOK, modules)
}

// GetModuleContent returns the content of a specific module
func (h *ModuleHandler) GetModuleContent(c *gin.Context) {
	moduleId := c.Param("moduleId")
	if moduleId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Module ID is required"})
		return
	}

	moduleContent, err := h.moduleService.GetModuleContent(moduleId)
	if err != nil {
		logrus.Errorf("Failed to load module content for %s: %v", moduleId, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
		return
	}

	c.JSON(http.StatusOK, moduleContent)
}
