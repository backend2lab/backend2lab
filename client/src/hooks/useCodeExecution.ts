import { useState, useCallback } from "react";
import { ModuleService } from "../services/moduleService";
import { ProgressService } from "../services/progressService";
import type { TestSuiteResult, RunResult } from "../services/moduleService";

export function useCodeExecution() {
  const [code, setCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResult | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  // Function to validate and protect code sections
  const validateAndProtectCode = useCallback((code: string, moduleId?: string) => {
    const targetModuleId = moduleId || currentModuleId;
    
    // Check if this is a server module (modules 2 and above)
    if (targetModuleId && targetModuleId.includes('module-')) {
      const moduleNum = parseInt(targetModuleId.replace('module-', '').replace('-js', ''));
      if (moduleNum >= 2) {
        // Check for protected code sections
        const protectedStart = '// ===== PROTECTED CODE - DO NOT MODIFY =====';
        const protectedEnd = '// ===== END PROTECTED CODE =====';
        
        const hasProtectedStart = code.includes(protectedStart);
        const hasProtectedEnd = code.includes(protectedEnd);
        
        if (hasProtectedStart && hasProtectedEnd) {
          // Extract the protected section
          const startIndex = code.indexOf(protectedStart);
          const endIndex = code.indexOf(protectedEnd) + protectedEnd.length;
          const protectedSection = code.substring(startIndex, endIndex);
          
          // Check if the protected section contains server.listen or app.listen
          if (!protectedSection.includes('server.listen') && !protectedSection.includes('app.listen')) {
            throw new Error('Protected code section is missing required server.listen() call. Please do not modify the protected section.');
          }
        } else if (hasProtectedStart || hasProtectedEnd) {
          throw new Error('Protected code section is incomplete. Please do not modify the protected section markers.');
        }
      }
    }
    
    return code;
  }, [currentModuleId]);

  // Enhanced setCode that also saves to localStorage and validates protected sections
  const setCodeWithSave = useCallback((newCode: string, moduleId?: string) => {
    // Ensure newCode is always a string
    const safeCode = typeof newCode === 'string' ? newCode : String(newCode || '');
    
    try {
      // Validate and protect code sections
      const validatedCode = validateAndProtectCode(safeCode, moduleId);
      setCode(validatedCode);
      const targetModuleId = moduleId || currentModuleId;
      if (targetModuleId) {
        ProgressService.saveCode(targetModuleId, validatedCode);
      }
    } catch (error) {
      // If validation fails, show error but don't update code
      setOutput(`⚠️ Code validation error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease do not modify the protected code sections.`);
      return;
    }
  }, [currentModuleId, validateAndProtectCode]);

  // Load saved code for a module
  const loadSavedCode = useCallback((moduleId: string, defaultCode: string) => {
    setCurrentModuleId(moduleId);
    setOriginalCode(defaultCode);
    const savedCode = ProgressService.getCode(moduleId);
    const codeToUse = savedCode || defaultCode;
    setCode(codeToUse);
    return codeToUse;
  }, []);


  const handleRunCode = async (currentModuleId: string, codeToRun?: string, exerciseType?: 'function' | 'server') => {
    // Handle case where codeToRun might be an object (Monaco Editor event)
    let codeContent: string;
    if (codeToRun && typeof codeToRun === 'string') {
      codeContent = codeToRun;
    } else {
      codeContent = code;
    }
    
    // Validate protected code sections before running
    try {
      validateAndProtectCode(codeContent, currentModuleId);
    } catch (error) {
      setOutput(`⚠️ Cannot run code: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease do not modify the protected code sections.`);
      return;
    }
    
    setIsRunning(true);
    setOutput("Running code...\n");
    
    try {
      const result: RunResult = await ModuleService.runCode(currentModuleId, codeContent);
      
      if (result.success) {
        if (exerciseType === 'function') {
          setOutput(`✓ Code executed successfully!\n\n--- Output ---\n${result.output || 'Code executed without output'}\n--- End Output ---\n\nExecution time: ${result.executionTime}ms\n\nYour code is working correctly!`);
        } else {
          setOutput(`✓ Code executed successfully!\n\n--- Output ---\n${result.output || 'Code is running'}\n--- End Output ---\n\nExecution time: ${result.executionTime}ms\n\nYour code is working correctly!`);
        }
      } else {
        setOutput(`✗ Code execution failed.\n\n--- Output ---\n${result.output || 'No output available'}\n--- End Output ---\n\nError: ${result.error}\n\nExecution time: ${result.executionTime}ms\n\nCheck your code for syntax errors or issues.`);
      }
      
      setTestResults(null);
    } catch (err) {
      setOutput(`✗ Code execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async (currentModuleId: string) => {
    // Ensure code is a string
    const safeCode = typeof code === 'string' ? code : String(code || '');
    
    // Validate protected code sections before submitting
    try {
      validateAndProtectCode(safeCode, currentModuleId);
    } catch (error) {
      setOutput(`⚠️ Cannot submit: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease do not modify the protected code sections.`);
      return false;
    }
    
    setIsSubmitting(true);
    setOutput("Running tests...\n");
    
    try {
      const results = await ModuleService.runTests(currentModuleId, safeCode);
      setTestResults(results);
      
      if (results.totalTests === 0) {
        setOutput(`⚠️ No tests were executed.\n\nExecution time: ${results.executionTime}ms\n\nPlease check that the test setup is working correctly.`);
      } else if (results.passedTests === results.totalTests) {
        setOutput(`✓ All ${results.totalTests} tests passed!\n\nExecution time: ${results.executionTime}ms\n\nCongratulations! You've successfully completed this exercise!`);
        return true; // Indicate success for confetti trigger
      } else {
        setOutput(`✗ ${results.failedTests} out of ${results.totalTests} tests failed.\n\nExecution time: ${results.executionTime}ms\n\nCheck the test results below for details.`);
      }
    } catch (err) {
      setOutput(`✗ Test execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setHasAttemptedSubmit(true);
      setIsSubmitting(false);
    }
    return false;
  };

  const resetState = () => {
    setOutput("");
    setTestResults(null);
    setHasAttemptedSubmit(false);
  };

  // Check if current code differs from original code
  const hasCodeChanged = useCallback(() => {
    return code !== originalCode;
  }, [code, originalCode]);

  return {
    code,
    setCode: setCodeWithSave,
    originalCode,
    output,
    isRunning,
    isSubmitting,
    testResults,
    hasAttemptedSubmit,
    handleRunCode,
    handleSubmit,
    resetState,
    loadSavedCode,
    hasCodeChanged,
  };
}
