import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCode, faPlay, faCheckCircle, faRocket, faFileCode } from '@fortawesome/free-solid-svg-icons';
import { faJs } from '@fortawesome/free-brands-svg-icons';
import Editor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [demoOutput, setDemoOutput] = useState('');
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [testResults, setTestResults] = useState<{passed: number, total: number, results: Array<{name: string, passed: boolean}>} | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const fullDemoCode = `// Welcome to Backend2Lab!
// This is a live code editor - try editing this code!

const express = require('express');
const app = express();

// Simple API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Backend2Lab!',
    timestamp: new Date().toISOString()
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Typing animation effect
  useEffect(() => {
    if (!isOpen || !isVisible) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    let isTyping = true;

    const typeText = () => {
      if (isTyping) {
        if (currentIndex < fullDemoCode.length) {
          setDemoCode(fullDemoCode.slice(0, currentIndex + 1));
          currentIndex++;
          // Vary typing speed - slower for new lines and punctuation
          const char = fullDemoCode[currentIndex];
          let delay = 20;
          if (char === '\n') delay = 200; // Pause at new lines
          else if (char === ' ') delay = 30; // Slight pause at spaces
          else if (['{', '}', '(', ')', ';'].includes(char)) delay = 100; // Pause at syntax
          else delay = Math.random() * 40 + 15; // Random speed for normal chars
          
          timeoutId = setTimeout(typeText, delay);
        } else {
          // Finished typing, wait a bit then run code
          setTimeout(() => {
            setIsAnimating(true);
            setDemoOutput('Running code...\n');
            
            setTimeout(() => {
              setDemoOutput(`✓ Code executed successfully!

--- Output ---
Server running on port 3000
✓ Express server started
✓ API endpoint /api/hello is ready

--- End Output ---

Execution time: 45ms

Your code is working correctly!`);
              
              // After showing output, wait and then run tests
              setTimeout(() => {
                setDemoOutput('Running tests...\n');
                
                setTimeout(() => {
                  const mockResults = {
                    passed: 3,
                    total: 3,
                    results: [
                      { name: 'Server starts successfully', passed: true },
                      { name: 'API endpoint responds correctly', passed: true },
                      { name: 'Port configuration works', passed: true }
                    ]
                  };
                  
                  setTestResults(mockResults);
                  setDemoOutput(`✓ All 3 tests passed!

Execution time: 89ms

Congratulations! You've successfully completed this exercise!`);
                  
                  // After showing test results, wait and reset for next cycle
                  setTimeout(() => {
                    setDemoCode('');
                    setDemoOutput('');
                    setTestResults(null);
                    setIsAnimating(false);
                    currentIndex = 0;
                    isTyping = true;
                    
                    // Start next cycle after a pause
                    setTimeout(() => {
                      typeText();
                    }, 2000);
                  }, 3000);
                }, 1500);
              }, 2000);
            }, 1500);
          }, 1000);
        }
      }
    };

    // Start the animation
    const startTimer = setTimeout(() => {
      typeText();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(startTimer);
    };
  }, [isOpen, isVisible, fullDemoCode]);

  // Cursor blinking effect
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStartLearning = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-60' : 'opacity-0'
        }`}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-7xl h-[90vh] bg-theme-surface border border-theme-primary rounded-2xl shadow-b2l-lg transform transition-all duration-300 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-theme-background border border-theme-primary text-theme-secondary hover:text-theme-primary hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors z-10"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} className="text-sm" />
        </button>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Column - Welcome Content */}
          <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-b2l-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl font-b2l">B2L</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-theme-primary font-b2l mb-1">
                  Welcome to Backend2Lab
                </h1>
                <p className="text-theme-secondary text-lg">
                  Your interactive backend development playground
                </p>
              </div>
            </div>

            {/* Platform Summary */}
            <div className="bg-theme-background rounded-xl p-6 border border-theme-primary mb-6">
              <h2 className="text-xl font-semibold text-theme-primary mb-4 font-b2l">
                What is Backend2Lab?
              </h2>
              <p className="text-theme-secondary leading-relaxed mb-4">
                Backend2Lab is an <strong className="text-theme-primary">interactive learning platform</strong> that combines 
                hands-on labs, practical exercises, and a real-time code playground. Learn backend development 
                concepts in a real Node.js environment, directly from your browser.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 gap-4 mt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-b2l-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FontAwesomeIcon icon={faCode} className="text-white text-sm" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-theme-primary text-sm mb-1">Interactive Labs</h3>
                    <p className="text-theme-secondary text-xs leading-relaxed">
                      Learn concepts through guided, hands-on tutorials
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-b2l-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FontAwesomeIcon icon={faPlay} className="text-white text-sm" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-theme-primary text-sm mb-1">Live Code Playground</h3>
                    <p className="text-theme-secondary text-xs leading-relaxed">
                      Write, run, and test code in real-time
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-b2l-highlight rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-theme-primary text-sm mb-1">Instant Feedback</h3>
                    <p className="text-theme-secondary text-xs leading-relaxed">
                      Get immediate test results and validation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gradient-to-r from-b2l-primary/10 to-b2l-accent/10 rounded-xl p-6 border border-b2l-primary/20 mb-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-3 font-b2l">
                Ready to start your backend journey?
              </h3>
              <p className="text-theme-secondary mb-4">
                Begin with Module 1 to learn the fundamentals, or explore any module that interests you. 
                Each module includes both lab content and hands-on exercises.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleStartLearning}
                  className="bg-gradient-to-r from-b2l-primary to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-b2l-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <FontAwesomeIcon icon={faRocket} className="text-sm" />
                  <span>Start Learning Now</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-theme-primary text-theme-primary rounded-xl font-semibold hover:bg-theme-background transition-colors"
                >
                  Explore First
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="text-center">
              <p className="text-theme-secondary text-sm">
                💡 <strong className="text-theme-primary">Pro tip:</strong> Try the live demo below!
              </p>
            </div>
          </div>

          {/* Right Column - Live Demo */}
          <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-theme-primary flex flex-col">
            {/* Demo Header */}
            <div className="p-4 border-b border-theme-primary bg-theme-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faJs} className="text-yellow-400" />
                  <span className="text-sm font-medium text-theme-primary font-b2l">Live Demo</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-500 font-medium">Auto-running</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1.5 text-xs font-medium bg-b2l-primary/20 text-b2l-primary rounded border border-b2l-primary/30 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faPlay} className="text-xs" />
                    <span>Auto Run</span>
                  </div>
                  <div className="px-3 py-1.5 text-xs font-medium bg-green-600/20 text-green-600 rounded border border-green-600/30 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                    <span>Auto Test</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={demoCode + (showCursor && !isAnimating ? '|' : '')}
                onChange={() => {}} // Disable manual editing during animation
                options={{ 
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineHeight: 20,
                  fontFamily: "'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                    useShadows: false,
                  },
                  fixedOverflowWidgets: true,
                  overviewRulerBorder: false,
                  hideCursorInOverviewRuler: true,
                  overviewRulerLanes: 0,
                  lineDecorationsWidth: 16,
                  glyphMargin: false,
                  folding: false,
                  lineNumbersMinChars: 2,
                  renderLineHighlight: 'line',
                  selectOnLineNumbers: true,
                  wordWrap: 'on',
                  wrappingStrategy: 'advanced',
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: 'on',
                  tabCompletion: 'on',
                  wordBasedSuggestions: 'off',
                  parameterHints: { enabled: false },
                  autoIndent: 'full',
                  formatOnPaste: false,
                  formatOnType: false,
                  dragAndDrop: false,
                  links: false,
                  colorDecorators: false,
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true, indentation: false },
                  renderWhitespace: 'none',
                  cursorBlinking: 'blink',
                  cursorStyle: 'line',
                  smoothScrolling: false,
                  mouseWheelScrollSensitivity: 1,
                  fastScrollSensitivity: 5,
                  padding: { top: 8, bottom: 8 },
                  contextmenu: true,
                  quickSuggestions: { other: true, comments: false, strings: false },
                  hover: { enabled: false },
                }}
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                className="rounded-none"
              />
            </div>

            {/* Output Panel */}
            <div className="border-t border-theme-primary bg-theme-background p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-theme-primary">Console</h3>
              </div>
              
              <div className="bg-theme-surface rounded border border-theme-primary p-3 h-24 overflow-y-auto">
                <pre className="text-xs text-theme-primary whitespace-pre-wrap font-mono">
                  {demoOutput || 'Ready to run your code...'}
                </pre>
              </div>

              {/* Test Results */}
              {testResults && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-theme-primary mb-2">Test Results</h4>
                  <div className="bg-theme-surface rounded border border-theme-primary p-3 max-h-20 overflow-y-auto">
                    <div className="space-y-1">
                      {testResults.results.map((result, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className={result.passed ? 'text-green-500' : 'text-red-500'}>
                            {result.passed ? <FontAwesomeIcon icon={faCheckCircle} className="text-xs" /> : <FontAwesomeIcon icon={faTimes} className="text-xs" />}
                          </span>
                          <span className="text-xs text-theme-primary">{result.name}</span>
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
    </div>
  );
}
