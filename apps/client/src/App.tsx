import { useState } from "react";
import CodeEditor from "./components/Editor";

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Language = 'JavaScript' | 'Python' | 'Java' | 'C++';
type Tab = 'Lab' | 'Exercise' | 'Test cases';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Lab');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('JavaScript');
  const [code, setCode] = useState(`// Two Sum Solution
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Test the function
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // Expected: [0, 1]`);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problemData = {
    title: "Two Sum",
    difficulty: 'Easy' as Difficulty,
    acceptanceRate: "48.5%",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Only one valid answer exists."
    ],
    testCases: [
      {
        input: "[2, 7, 11, 15]\n9",
        output: "[0, 1]"
      },
      {
        input: "[3, 2, 4]\n6",
        output: "[1, 2]"
      }
    ]
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running test cases...\n");
    
    // Simulate test case execution
    setTimeout(() => {
      const results = problemData.testCases.map((testCase, index) => {
        return `Test case ${index + 1}:\nInput: ${testCase.input}\nExpected: ${testCase.output}\nOutput: [0, 1]\nStatus: ✅ Passed\n`;
      }).join('\n');
      
      setOutput(results + "\nAll test cases passed! 🎉");
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("Submitting solution...\n");
    
    // Simulate submission
    setTimeout(() => {
      setOutput("✅ Accepted!\n\nRuntime: 84 ms (beats 67.8%)\nMemory: 42.3 MB (beats 89.2%)\n\nGreat job! Your solution is efficient.");
      setIsSubmitting(false);
    }, 3000);
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-100 text-success-700';
      case 'Medium': return 'bg-warning-100 text-warning-700';
      case 'Hard': return 'bg-error-100 text-error-700';
    }
  };

  const tabs: Tab[] = ['Lab', 'Exercise', 'Test cases'];

  return (
    <div className="min-h-screen bg-tactical-background">
      {/* Header Bar */}
      <header className="navbar-tactical">
        <div className="nav-container-tactical">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-tactical-primary rounded-lg flex items-center justify-center shadow-tactical">
              <span className="text-white font-bold text-sm font-tactical">LC</span>
            </div>
            <span className="text-xl font-bold text-tactical-text-primary font-tactical">LeetCode</span>
          </div>

          {/* Problem Title */}
          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-tactical-text-primary font-tactical">{problemData.title}</h1>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problemData.difficulty)}`}>
                  {problemData.difficulty}
                </span>
                <span className="text-xs text-tactical-text-secondary font-tactical">Acceptance: {problemData.acceptanceRate}</span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-tactical-text-secondary hover:text-tactical-text-primary transition-colors rounded-lg hover:bg-neutral-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-tactical-border-primary rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer">
              <span className="text-tactical-text-primary font-medium text-sm font-tactical">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-tactical-background">
        {/* Left Panel - Problem Description */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-tactical-border-primary bg-tactical-background flex flex-col shadow-tactical">
          {/* Tab Navigation */}
          <div className="border-b border-tactical-border-primary bg-tactical-surface">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-button-tactical ${activeTab === tab ? 'active' : 'inactive'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-tactical-background">
            {activeTab === 'Lab' && (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-tactical-text-secondary leading-relaxed whitespace-pre-line font-tactical">
                    {problemData.description}
                  </p>
                </div>

                {/* Sample Test Cases */}
                <div>
                  <h3 className="tactical-section-header mb-4">SAMPLE TEST CASES</h3>
                  <div className="space-y-4">
                    {problemData.testCases.map((testCase, index) => (
                      <div key={index} className="test-case-card-tactical">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="input-label-tactical">Input</label>
                            <div className="test-case-input-tactical">
                              {testCase.input}
                            </div>
                          </div>
                          <div>
                            <label className="input-label-tactical">Expected Output</label>
                            <div className="test-case-input-tactical">
                              {testCase.output}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Exercise' && (
              <div className="space-y-6">
                {problemData.examples.map((example, index) => (
                  <div key={index} className="test-case-card-tactical">
                    <h4 className="font-semibold text-tactical-text-primary mb-3 font-tactical">Example {index + 1}:</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-tactical-text-secondary font-tactical">Input: </span>
                        <code className="bg-tactical-surface px-2 py-1 rounded-lg text-sm font-tactical border border-tactical-border-primary text-tactical-text-primary">{example.input}</code>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-tactical-text-secondary font-tactical">Output: </span>
                        <code className="bg-tactical-surface px-2 py-1 rounded-lg text-sm font-tactical border border-tactical-border-primary text-tactical-text-primary">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-sm font-medium text-tactical-text-secondary font-tactical">Explanation: </span>
                          <span className="text-sm text-tactical-text-secondary font-tactical">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Test cases' && (
              <div className="space-y-4">
                <h3 className="tactical-section-header">CONSTRAINTS:</h3>
                <ul className="space-y-2">
                  {problemData.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-tactical-text-secondary mt-1">•</span>
                      <span className="text-tactical-text-secondary font-tactical">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Editor + Console */}
        <div className="w-full lg:w-1/2 bg-tactical-background flex flex-col shadow-tactical">
          {/* Code Editor */}
          <div className="flex-1 bg-tactical-background">
            <CodeEditor 
              code={code} 
              runCode={setCode} 
              readOnly={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="border-t border-tactical-border-primary px-4 sm:px-6 py-4 bg-tactical-surface">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn-tactical-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <div className="loading-spinner-tactical mr-2"></div>
                    Running...
                  </>
                ) : (
                  'Run'
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-tactical-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner-tactical mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>

          {/* Console Output */}
          <div className="console-container-tactical">
            <div className="console-header-tactical">
              <h3 className="text-sm font-medium text-tactical-text-secondary font-tactical">Console</h3>
            </div>
            <div className="console-content-tactical">
              {output ? (
                <pre className="console-output-tactical">
                  {output}
                </pre>
              ) : (
                <p className="text-tactical-text-secondary text-sm font-tactical">
                  Run your code to see the output here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
