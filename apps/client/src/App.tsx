import { useState } from "react";
import CodeEditor from "./components/Editor";

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Language = 'JavaScript' | 'Python' | 'Java' | 'C++';
type Tab = 'Description' | 'Examples' | 'Constraints' | 'Submissions';



export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Description');
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

  const tabs: Tab[] = ['Description', 'Examples', 'Constraints', 'Submissions'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 space-y-2 sm:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LeetCode</span>
          </div>

          {/* Problem Title */}
          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">{problemData.title}</h1>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problemData.difficulty)}`}>
                  {problemData.difficulty}
                </span>
                <span className="text-xs text-gray-500">Acceptance: {problemData.acceptanceRate}</span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-gray-50">
        {/* Left Panel - Problem Description */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'Description' && (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {problemData.description}
                  </p>
                </div>

                {/* Sample Test Cases */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Test Cases</h3>
                  <div className="space-y-4">
                                         {problemData.testCases.map((testCase, index) => (
                       <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
                             <div className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm shadow-sm">
                               {testCase.input}
                             </div>
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Expected Output</label>
                             <div className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm shadow-sm">
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

                         {activeTab === 'Examples' && (
               <div className="space-y-6">
                 {problemData.examples.map((example, index) => (
                   <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Example {index + 1}:</h4>
                    <div className="space-y-3">
                                             <div>
                         <span className="text-sm font-medium text-gray-700">Input: </span>
                         <code className="bg-white px-2 py-1 rounded-lg text-sm font-mono border border-gray-200">{example.input}</code>
                       </div>
                       <div>
                         <span className="text-sm font-medium text-gray-700">Output: </span>
                         <code className="bg-white px-2 py-1 rounded-lg text-sm font-mono border border-gray-200">{example.output}</code>
                       </div>
                      {example.explanation && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Explanation: </span>
                          <span className="text-sm text-gray-600">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Constraints' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Constraints:</h3>
                <ul className="space-y-2">
                  {problemData.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-700">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'Submissions' && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No submissions yet</p>
                  <p className="text-sm">Submit your solution to see your submission history</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Editor + Console */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col shadow-sm">
          {/* Language Selector */}
          <div className="border-b border-gray-200 px-4 sm:px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Language:</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                </select>
              </div>
                              <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Ready</span>
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <CodeEditor 
              code={code} 
              runCode={setCode} 
              readOnly={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                              <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-transparent text-primary-600 px-6 py-3 rounded-lg font-medium border-2 border-primary-600 cursor-pointer transition-all duration-200 hover:bg-primary-50 hover:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin mr-2"></div>
                      Running...
                    </>
                  ) : (
                    'Run'
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium border-none cursor-pointer transition-all duration-200 hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
            </div>
          </div>

          {/* Console Output */}
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-white">
              <h3 className="text-sm font-medium text-gray-700">Console</h3>
            </div>
            <div className="p-4 h-32 sm:h-48 overflow-y-auto bg-white">
              {output ? (
                <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {output}
                </pre>
              ) : (
                <p className="text-gray-500 text-sm">
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
