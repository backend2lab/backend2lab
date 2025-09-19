import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import type { TestSuiteResult, TestResult } from "../services/moduleService";

interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  isSubmitting: boolean;
  testResults: TestSuiteResult | null;
  onRunCode: () => void;
  onSubmit: () => void;
}

export function OutputPanel({
  output,
  isRunning,
  isSubmitting,
  testResults,
  onRunCode,
  onSubmit,
}: OutputPanelProps) {
  return (
    <div className="border-t border-theme-primary bg-theme-surface p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-theme-primary">Console</h3>
        <div className="flex space-x-2">
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs font-medium bg-b2l-primary text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={onSubmit}
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
              {testResults.results && testResults.results.length > 0 ? (
                testResults.results.map((result: TestResult, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className={result.passed ? 'text-green-500' : 'text-red-500'}>
                      {result.passed ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                    </span>
                    <span className="text-sm text-theme-primary">{result.testName}</span>
                    {!result.passed && result.error && (
                      <span className="text-xs text-red-400">({result.error})</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-theme-secondary">
                  {testResults.totalTests === 0 ? 'No tests were executed' : 'No test results available'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
