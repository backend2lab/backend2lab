import { useState, useEffect } from "react";
import CodeEditor from "./components/Editor";
import MarkdownRenderer from "./components/MarkdownRenderer";
import { ModuleService } from "./services/moduleService.js";
import type { ModuleContent, TestSuiteResult, RunResult } from "./services/moduleService.js";

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type Tab = 'Lab' | 'Exercise';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Lab');
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResult | null>(null);

  // Default module ID - could be made configurable later
  const currentModuleId = 'module-1';

  useEffect(() => {
    loadModuleContent();
  }, []);

  const loadModuleContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const content = await ModuleService.getModuleContent(currentModuleId);
      setModuleContent(content);
      setCode(content.exerciseContent.editorFiles.server);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module content');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async (codeToRun?: string) => {
    if (!moduleContent) return;
    
    const codeContent = codeToRun || code;
    
    setIsRunning(true);
    setOutput("Running server...\n");
    
    try {
      // Send code to server for execution
      const result: RunResult = await ModuleService.runCode(currentModuleId, codeContent);
      
      if (result.success) {
        setOutput(`✅ Server started successfully!\n\n--- Server Output ---\n${result.serverOutput || 'Server is running on port 3000'}\n--- End Output ---\n\nExecution time: ${result.executionTime}ms\n\nYour server is running correctly!`);
      } else {
        setOutput(`❌ Server failed to start.\n\n--- Server Output ---\n${result.serverOutput || 'No server output available'}\n--- End Output ---\n\nError: ${result.error}\n\nExecution time: ${result.executionTime}ms\n\nCheck your code for syntax errors or issues.`);
      }
      
      // Clear test results when just running code
      setTestResults(null);
    } catch (err) {
      setOutput(`❌ Server execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!moduleContent) return;
    
    setIsSubmitting(true);
    setOutput("Testing server...\n");
    
    try {
      const results = await ModuleService.runTests(currentModuleId, code);
      setTestResults(results);
      
      if (results.passedTests === results.totalTests) {
        setOutput(`✅ All ${results.totalTests} tests passed!\n\nExecution time: ${results.executionTime}ms\n\nCongratulations! You've successfully completed this exercise!`);
      } else {
        setOutput(`❌ ${results.failedTests} out of ${results.totalTests} tests failed.\n\nExecution time: ${results.executionTime}ms\n\nCheck the test results below for details.`);
      }
    } catch (err) {
      setOutput(`❌ Test execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-tactical-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-primary mx-auto mb-4"></div>
          <p className="text-tactical-text-secondary">Loading module content...</p>
        </div>
      </div>
    );
  }

  if (error || !moduleContent) {
    return (
      <div className="min-h-screen bg-tactical-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-tactical-text-primary mb-2">Failed to load module</p>
          <p className="text-tactical-text-secondary mb-4">{error}</p>
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
    <div className="min-h-screen bg-tactical-background">
      {/* Header Bar */}
      <header className="bg-tactical-surface border-b border-tactical-border-primary shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-tactical-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm font-tactical">B2L</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-tactical-text-primary font-tactical">Backend2Lab</span>
                <span className="text-xs text-tactical-text-secondary font-tactical">Learn Backend Development</span>
              </div>
            </div>

            {/* Module Info */}
            <div className="flex-1 flex justify-center max-w-2xl">
              <div className="text-center flex">
                <h1 className="text-lg font-semibold text-tactical-text-primary font-tactical">{moduleContent.module.title}</h1>
                <div className="flex items-center justify-center space-x-3 mt- ml-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(moduleContent.module.difficulty)}`}>
                    {moduleContent.module.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-tactical-text-secondary hover:text-tactical-text-primary transition-colors rounded-lg hover:bg-neutral-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-tactical-border-primary to-neutral-700 rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer">
                <span className="text-tactical-text-primary font-medium text-sm font-tactical">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-tactical-background overflow-hidden">
        {/* Left Panel - Learning Content */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-tactical-border-primary bg-tactical-background flex flex-col min-h-0">
          {/* Tab Navigation */}
          <div className="border-b border-tactical-border-primary bg-tactical-surface flex-shrink-0">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === tab 
                      ? 'text-tactical-primary border-tactical-primary bg-tactical-background' 
                      : 'text-tactical-text-secondary border-transparent hover:text-tactical-text-primary hover:bg-neutral-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-tactical-background min-h-0">
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
        <div className="w-full lg:w-1/2 bg-tactical-background flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <CodeEditor 
              code={code} 
              onCodeChange={setCode}
              testCases={moduleContent.exerciseContent.editorFiles.test}
              solution={moduleContent.exerciseContent.solution}
              runCode={handleRunCode}
            />
          </div>
          
          {/* Output Panel */}
          <div className="border-t border-tactical-border-primary bg-tactical-surface p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-tactical-text-primary">Output</h3>
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
            
            <div className="bg-tactical-background rounded border border-tactical-border-primary p-3 h-32 overflow-y-auto">
              <pre className="text-sm text-tactical-text-primary whitespace-pre-wrap font-mono">
                {output || 'Ready to run your code...'}
              </pre>
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-tactical-text-primary mb-2">Test Results</h4>
                <div className="bg-tactical-background rounded border border-tactical-border-primary p-3 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {testResults.results.map((result, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className={result.passed ? 'text-green-500' : 'text-red-500'}>
                          {result.passed ? '✅' : '❌'}
                        </span>
                        <span className="text-sm text-tactical-text-primary">{result.testName}</span>
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
