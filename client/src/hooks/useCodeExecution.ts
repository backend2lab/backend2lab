import { useState } from "react";
import { ModuleService } from "../services/moduleService";
import type { TestSuiteResult, RunResult } from "../services/moduleService";

export function useCodeExecution() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResult | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleRunCode = async (currentModuleId: string, codeToRun?: string, exerciseType?: 'function' | 'server') => {
    const codeContent = codeToRun || code;
    
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
    setIsSubmitting(true);
    setOutput("Running tests...\n");
    
    try {
      const results = await ModuleService.runTests(currentModuleId, code);
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

  return {
    code,
    setCode,
    output,
    isRunning,
    isSubmitting,
    testResults,
    hasAttemptedSubmit,
    handleRunCode,
    handleSubmit,
    resetState,
  };
}
