import { useState, useEffect, useCallback } from "react";
import { ModuleService } from "../services/moduleService";
import type { ModuleContent, Module } from "../services/moduleService";

export function useModuleManagement() {
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [groupedModules, setGroupedModules] = useState<Record<string, Module[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState('module-1-js');
  const [pendingModuleId, setPendingModuleId] = useState<string | null>(null);

  const loadAvailableModules = useCallback(async () => {
    try {
      const modules = await ModuleService.getAllModules();
      setAvailableModules(modules);
      
      // Group modules by base ID (e.g., "module-1" from "module-1-js" or "module-1-python")
      const grouped: Record<string, Module[]> = {};
      modules.forEach(module => {
        const baseId = module.id.replace(/-(js|python)$/, '');
        if (!grouped[baseId]) {
          grouped[baseId] = [];
        }
        grouped[baseId].push(module);
      });
      setGroupedModules(grouped);
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
    
    // If the moduleId doesn't have a language suffix, default to JS
    let finalModuleId = moduleId;
    if (!moduleId.includes('-js') && !moduleId.includes('-python')) {
      finalModuleId = `${moduleId}-js`;
    }
    
    setCurrentModuleId(finalModuleId);
    
    // Update URL parameter without page refresh
    const url = new URL(window.location.href);
    url.searchParams.set('lab', finalModuleId);
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

  // Helper functions
  const getCurrentBaseModule = useCallback(() => {
    const baseId = currentModuleId.replace(/-(js|python)$/, '');
    return groupedModules[baseId] || [];
  }, [currentModuleId, groupedModules]);

  const getCurrentLanguage = useCallback(() => {
    return currentModuleId.endsWith('-python') ? 'python' : 'js';
  }, [currentModuleId]);

  const switchLanguage = useCallback((language: 'js' | 'python') => {
    const baseId = currentModuleId.replace(/-(js|python)$/, '');
    const newModuleId = `${baseId}-${language}`;
    
    // Check if the new module exists
    const targetModule = availableModules.find(m => m.id === newModuleId);
    if (targetModule) {
      handleModuleChange(newModuleId);
    }
  }, [currentModuleId, handleModuleChange, availableModules]);

  return {
    moduleContent,
    availableModules,
    groupedModules,
    loading,
    error,
    currentModuleId,
    pendingModuleId,
    setCurrentModuleId,
    setPendingModuleId,
    handleModuleChange,
    loadModuleContent,
    getCurrentBaseModule,
    getCurrentLanguage,
    switchLanguage,
  };
}
