import { useState, useEffect, useCallback } from "react";
import { ModuleService } from "../services/moduleService";
import type { ModuleContent, Module } from "../services/moduleService";

export function useModuleManagement() {
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState('module-1');
  const [pendingModuleId, setPendingModuleId] = useState<string | null>(null);

  const loadAvailableModules = useCallback(async () => {
    try {
      const modules = await ModuleService.getAllModules();
      setAvailableModules(modules);
    } catch (err) {
      console.error('Failed to load available modules:', err);
    }
  }, []);

  const loadModuleContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const content = await ModuleService.getModuleContent(currentModuleId);
      setModuleContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module content');
    } finally {
      setLoading(false);
    }
  }, [currentModuleId]);

  const handleModuleChange = useCallback((moduleId: string) => {
    if (moduleId === currentModuleId) return;
    
    setCurrentModuleId(moduleId);
    
    // Update URL parameter without page refresh
    const url = new URL(window.location.href);
    url.searchParams.set('lab', moduleId);
    window.history.pushState({}, '', url.toString());
  }, [currentModuleId]);

  // Load available modules on mount
  useEffect(() => {
    loadAvailableModules();
  }, [loadAvailableModules]);

  // Load module content when currentModuleId changes
  useEffect(() => {
    loadModuleContent();
  }, [loadModuleContent]);

  return {
    moduleContent,
    availableModules,
    loading,
    error,
    currentModuleId,
    pendingModuleId,
    setCurrentModuleId,
    setPendingModuleId,
    handleModuleChange,
    loadModuleContent,
  };
}
