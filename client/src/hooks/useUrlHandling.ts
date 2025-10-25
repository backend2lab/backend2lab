import { useEffect, useState } from "react";
import type { Module } from "../services/moduleService";

export function useUrlHandling(availableModules: Module[], _currentModuleId: string, setCurrentModuleId: (id: string) => void) {
  const [pendingModuleId, setPendingModuleId] = useState<string | null>(null);

  // Handle initial URL parameter and browser navigation
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const labIdFromUrl = queryParams.get('lab');

    if (labIdFromUrl) {
      const isValidModuleId = /^module-\d+(-(js|python))?$/.test(labIdFromUrl);
      
      if (isValidModuleId) {
        setPendingModuleId(labIdFromUrl);
      } else {
        setCurrentModuleId('module-1-js');
        const url = new URL(window.location.href);
        url.searchParams.set('lab', 'module-1-js');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const labIdFromUrl = queryParams.get('lab');
      
      if (labIdFromUrl) {
        const isValidModuleId = /^module-\d+(-(js|python))?$/.test(labIdFromUrl);
        const moduleExists = availableModules.length > 0 ? availableModules.some(module => module.id === labIdFromUrl) : true;
        
        if (isValidModuleId && moduleExists) {
          setCurrentModuleId(labIdFromUrl);
        } else if (!isValidModuleId || !moduleExists) {
          setCurrentModuleId('module-1-js');
          const url = new URL(window.location.href);
          url.searchParams.set('lab', 'module-1-js');
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        setCurrentModuleId('module-1-js');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [availableModules, setCurrentModuleId]);

  // Validate URL parameter against available modules after they're loaded
  useEffect(() => {
    if (availableModules.length > 0) {
      if (pendingModuleId) {
        const moduleExists = availableModules.some(module => module.id === pendingModuleId);
        
        if (moduleExists) {
          setCurrentModuleId(pendingModuleId);
        } else {
          // If the module doesn't exist, try to find the JS version of the base module
          const baseId = pendingModuleId.replace(/-(js|python)$/, '');
          const jsModuleId = `${baseId}-js`;
          const jsModuleExists = availableModules.some(module => module.id === jsModuleId);
          
          if (jsModuleExists) {
            setCurrentModuleId(jsModuleId);
            const url = new URL(window.location.href);
            url.searchParams.set('lab', jsModuleId);
            window.history.replaceState({}, '', url.toString());
          } else {
            setCurrentModuleId('module-1-js');
            const url = new URL(window.location.href);
            url.searchParams.set('lab', 'module-1-js');
            window.history.replaceState({}, '', url.toString());
          }
        }
        setPendingModuleId(null);
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const labIdFromUrl = queryParams.get('lab');
      
      if (labIdFromUrl) {
        const isValidModuleId = /^module-\d+(-(js|python))?$/.test(labIdFromUrl);
        const moduleExists = availableModules.some(module => module.id === labIdFromUrl);
        
        if (!isValidModuleId || !moduleExists) {
          // If the module doesn't exist, try to find the JS version of the base module
          const baseId = labIdFromUrl.replace(/-(js|python)$/, '');
          const jsModuleId = `${baseId}-js`;
          const jsModuleExists = availableModules.some(module => module.id === jsModuleId);
          
          if (jsModuleExists) {
            setCurrentModuleId(jsModuleId);
            const url = new URL(window.location.href);
            url.searchParams.set('lab', jsModuleId);
            window.history.replaceState({}, '', url.toString());
          } else {
            setCurrentModuleId('module-1-js');
            const url = new URL(window.location.href);
            url.searchParams.set('lab', 'module-1-js');
            window.history.replaceState({}, '', url.toString());
          }
        }
      }
    }
  }, [availableModules, pendingModuleId, setCurrentModuleId]);

  return { pendingModuleId, setPendingModuleId };
}
