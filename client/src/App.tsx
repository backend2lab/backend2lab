import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CodeEditor from "./components/Editor";
import MarkdownRenderer from "./components/MarkdownRenderer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { ModuleService } from "./services/moduleService.js";
import type { ModuleContent, TestSuiteResult, RunResult, Module } from "./services/moduleService.js";

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type Tab = 'Lab' | 'Exercise';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('Lab');
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResult | null>(null);
  const [exerciseType, setExerciseType] = useState<'function' | 'server'>('function');
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Default module ID - could be made configurable later
  const [currentModuleId, setCurrentModuleId] = useState('module-1');

  useEffect(() => {
    loadAvailableModules();
  }, []);

  useEffect(() => {
    loadModuleContent();
  }, [currentModuleId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.module-dropdown')) {
        setShowModuleDropdown(false);
      }
    };

    if (showModuleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModuleDropdown]);

  const loadAvailableModules = async () => {
    try {
      const modules = await ModuleService.getAllModules();
      setAvailableModules(modules);
    } catch (err) {
      console.error('Failed to load available modules:', err);
    }
  };

  const loadModuleContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const content = await ModuleService.getModuleContent(currentModuleId);
      setModuleContent(content);
      setCode(content.exerciseContent.editorFiles.server);
      
      // Set exercise type based on module ID
      setExerciseType(currentModuleId === 'module-1' ? 'function' : 'server');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module content');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (moduleId: string) => {
    if (moduleId === currentModuleId) {
      setShowModuleDropdown(false);
      return;
    }
    
    setShowModuleDropdown(false);
    setCurrentModuleId(moduleId);
    setOutput("");
    setTestResults(null);
    setActiveTab('Lab'); // Reset to Lab tab when switching modules
  };

  const handleRunCode = async (codeToRun?: string) => {
    if (!moduleContent) return;
    
    const codeContent = codeToRun || code;
    
    setIsRunning(true);
    setOutput("Running code...\n");
    
    try {
      // Send code to server for execution
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
      
      // Clear test results when just running code
      setTestResults(null);
    } catch (err) {
      setOutput(`✗ Code execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!moduleContent) return;
    
    setIsSubmitting(true);
 
    setOutput("Running tests...\n");
    
    try {
      const results = await ModuleService.runTests(currentModuleId, code);
      setTestResults(results);
      
      if (results.passedTests === results.totalTests) {
        setOutput(`✓ All ${results.totalTests} tests passed!\n\nExecution time: ${results.executionTime}ms\n\nCongratulations! You've successfully completed this exercise!`);
      } else {
        setOutput(`✗ ${results.failedTests} out of ${results.totalTests} tests failed.\n\nExecution time: ${results.executionTime}ms\n\nCheck the test results below for details.`);
      }
    } catch (err) {
      setOutput(`✗ Test execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setHasAttemptedSubmit(true);
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success-100 text-success-700';
      case 'Intermediate': return 'bg-warning-100 text-warning-700';
      case 'Advanced': return 'bg-error-100 text-error-700';
      default: return 'bg-success-100 text-success-700';
    }
  };

  const tabs: Tab[] = ['Lab', 'Exercise'];

  if (loading && !moduleContent) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-primary mx-auto mb-4"></div>
          <p className="text-theme-secondary">Loading module content...</p>
        </div>
      </div>
    );
  }

  if (error || !moduleContent) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-theme-primary mb-2">Failed to load module</p>
          <p className="text-theme-secondary mb-4">{error}</p>
          <button 
            onClick={loadModuleContent}
            className="px-4 py-2 bg-tactical-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Header Bar */}
      <header className="bg-theme-surface border-b border-theme-primary shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-tactical-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm font-tactical">B2L</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-theme-primary font-tactical">Backend2Lab</span>
                <span className="text-xs text-theme-secondary font-tactical">Learn Backend Development</span>
              </div>
            </div>

            {/* Module Info */}
            <div className="flex-1 flex justify-center max-w-2xl">
              <div className="text-center flex items-center">
                <h1 className="text-lg font-semibold text-theme-primary font-tactical">
                  {loading && moduleContent ? (
                    <div className="flex items-center space-x-2">
                      <span>{moduleContent.module.title}</span>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tactical-primary"></div>
                    </div>
                  ) : (
                    moduleContent?.module.title || 'Loading...'
                  )}
                </h1>
                {moduleContent && (
                  <div className="flex items-center justify-center space-x-3 ml-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(moduleContent.module.difficulty)}`}>
                      {moduleContent.module.difficulty}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Theme Toggle and Module Selector */}
            <div className="flex items-center space-x-3">              
              <div className="relative module-dropdown">
                <button 
                  onClick={() => setShowModuleDropdown(!showModuleDropdown)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-theme-surface border border-theme-primary rounded-lg text-theme-primary hover:bg-slate-100 dark:hover:bg-neutral-800 light:hover:bg-tactical-light-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium font-tactical">
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <span>{availableModules.find(m => m.id === currentModuleId)?.title || 'Select Module'}</span>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-tactical-primary"></div>
                      </div>
                    ) : (
                      availableModules.find(m => m.id === currentModuleId)?.title || 'Select Module'
                    )}
                  </span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs transition-transform ${showModuleDropdown ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {showModuleDropdown && (
                  <div className="absolute right-0 mt-2 bg-theme-surface border border-theme-primary rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto module-dropdown">
                    {availableModules.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => handleModuleChange(module.id)}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors border-b border-theme-primary last:border-b-0 ${
                          module.id === currentModuleId 
                            ? 'bg-tactical-primary text-white' 
                            : 'text-theme-primary'
                        }`}
                      >
                        <span className="text-sm font-medium">
                          <span className="mr-2">{module.id}:</span>
                          {module.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
                            <ThemeToggle />

            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-theme-background overflow-hidden">
        {/* Left Panel - Learning Content */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-theme-primary bg-theme-background flex flex-col min-h-0">
          {/* Tab Navigation */}
          <div className="border-b border-theme-primary bg-theme-surface flex-shrink-0 h-12">
            <div className="flex h-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 text-sm font-medium transition-all duration-200 border-b-2 flex items-center justify-center ${
                    activeTab === tab 
                      ? 'text-tactical-primary border-tactical-primary bg-theme-background' 
                      : 'text-theme-secondary border-transparent hover:text-theme-primary hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-theme-background min-h-0">
            {activeTab === 'Lab' && (
              <div className="max-w-4xl mx-auto p-6 space-y-8">
                <MarkdownRenderer content={moduleContent.labContent} />
              </div>
            )}
            {activeTab === 'Exercise' && (
              <div className="max-w-4xl mx-auto p-6 space-y-8">
                <MarkdownRenderer content={moduleContent.exerciseContent.readme} />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-full lg:w-1/2 bg-theme-background flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <CodeEditor 
              code={code} 
              onCodeChange={setCode}
              testCases={moduleContent.exerciseContent.editorFiles.test}
              solution={moduleContent.exerciseContent.solution}
              runCode={handleRunCode}
              hasAttemptedSubmit={hasAttemptedSubmit}
            />
          </div>
          
          {/* Output Panel */}
          <div className="border-t border-theme-primary bg-theme-surface p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-theme-primary">Console</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRunCode()}
                  disabled={isRunning}
                  className="px-3 py-1.5 text-xs font-medium bg-tactical-primary text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Testing...' : 'Submit'}
                </button>
              </div>
            </div>
            
            <div className="bg-theme-background rounded border border-theme-primary p-3 h-32 overflow-y-auto">
              <pre className="text-sm text-theme-primary whitespace-pre-wrap font-mono">
                {output || 'Ready to run your code...'}
              </pre>
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-theme-primary mb-2">Test Results</h4>
                <div className="bg-theme-background rounded border border-theme-primary p-3 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {testResults.results.map((result, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className={result.passed ? 'text-green-500' : 'text-red-500'}>
                          {result.passed ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                        </span>
                        <span className="text-sm text-theme-primary">{result.testName}</span>
                        {!result.passed && result.error && (
                          <span className="text-xs text-red-400">({result.error})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
