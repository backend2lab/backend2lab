import { useState } from "react";
import CodeEditor from "./components/Editor";
import { StepCard } from "./components/StepCard";
import { CodeDisplay } from "./components/CodeDisplay";

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Tab = 'Lab' | 'Exercise';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Lab');
  const [code, setCode] = useState(`// Hello World Server
// Your task: Create a Node.js HTTP server that returns "Hello, World!"

const http = require('http');

// TODO: Implement your server here
// 1. Create an HTTP server using http.createServer()
// 2. Handle GET requests to the root path "/"
// 3. Return JSON response: { "message": "Hello, World!" }
// 4. Set Content-Type header to "application/json"
// 5. Handle other paths with 404 status
// 6. Listen on port 3000

// Your implementation goes here...

console.log('Server starting...');`);

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

  const tabs: Tab[] = ['Lab', 'Exercise'];

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
            <div className="flex overflow-x-auto justify-evenly">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-button-tactical ${activeTab === tab ? 'active' : 'inactive'} w-full`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-tactical-background">
            {activeTab === 'Lab' && (
              <div className="space-y-8">
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-8">
                    <StepCard
                      stepNumber={1}
                      title="Module 1: API Basics & Express Setup"
                      description="Welcome to your first step in backend API development! 🎉 In this module, you'll learn the fundamentals of APIs, HTTP, and how to build your first server."
                      additionalContent={
                        <div className="space-y-4">
                          <p>
                            <strong>What you'll learn:</strong>
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-tactical-primary mt-1">•</span>
                              <span>What an API is and how it works</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-tactical-primary mt-1">•</span>
                              <span>HTTP methods, status codes, and request/response cycle</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-tactical-primary mt-1">•</span>
                              <span>How to set up a Node.js server from scratch</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-tactical-primary mt-1">•</span>
                              <span>Building your first API endpoints</span>
                            </li>
                          </ul>
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={2}
                      title="🌐 What is an API?"
                      description="An API (Application Programming Interface) allows two systems to communicate. In web development, APIs use HTTP protocol."
                      additionalContent={
                        <div className="space-y-4">
                          <p>
                            APIs are like waiters in a restaurant - they take your request, communicate with the kitchen (server), and bring back your food (response).
                          </p>
                          <div className="bg-tactical-surface p-4 rounded-lg border border-tactical-border-primary">
                            <p className="text-sm font-semibold mb-2">Example Request/Response Cycle:</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-green-400">Client:</span>
                                <code className="bg-neutral-900 px-2 py-1 rounded">GET /hello</code>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-blue-400">Server:</span>
                                <code className="bg-neutral-900 px-2 py-1 rounded">{'{ "message": "Hello, World!" }'}</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={3}
                      title="🛠️ HTTP Basics"
                      description="HTTP is the language that APIs use to communicate. Understanding HTTP methods and status codes is crucial."
                      additionalContent={
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">HTTP Methods:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <code className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">GET</code>
                                <span>→ retrieve data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">POST</code>
                                <span>→ send new data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs">PUT/PATCH</code>
                                <span>→ update existing data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">DELETE</code>
                                <span>→ remove data</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Common Status Codes:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <code className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">200</code>
                                <span>OK → Success</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs">400</code>
                                <span>Bad Request → Invalid input</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">404</code>
                                <span>Not Found → Resource not found</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">500</code>
                                <span>Internal Server Error → Something broke</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={4}
                      title="🚀 Setting up a Node.js Server"
                      description="Let's build a simple HTTP server using pure Node.js (no frameworks). This teaches you the fundamentals."
                      codeBlock={{
                        language: "javascript",
                        code: `const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle different routes
  if (req.url === '/hello' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello, World!' }));
  } else if (req.url === '/api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
                        showLineNumbers: true
                      }}
                      additionalContent={
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-tactical-primary">•</span>
                            <span>Pure Node.js - no external dependencies</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-tactical-primary">•</span>
                            <span>Handles multiple routes and HTTP methods</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-tactical-primary">•</span>
                            <span>Includes CORS headers for web compatibility</span>
                          </div>
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={5}
                      title="📝 Adding POST Endpoint"
                      description="Let's add a POST endpoint to handle data creation. This shows how to parse request bodies."
                      codeBlock={{
                        language: "javascript",
                        code: `const http = require('http');

// In-memory storage (in real apps, use a database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' }
];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.url === '/api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.url === '/api/users' && req.method === 'POST') {
    let body = '';
    
    // Collect data from request stream
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    // Process complete request
    req.on('end', () => {
      try {
        const newUser = JSON.parse(body);
        newUser.id = users.length + 1;
        users.push(newUser);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
                        showLineNumbers: true
                      }}
                      additionalContent={
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-tactical-primary">•</span>
                            <span>Handles JSON request bodies</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-tactical-primary">•</span>
                            <span>Returns 201 status for successful creation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-tactical-primary">•</span>
                            <span>Includes error handling for invalid JSON</span>
                          </div>
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={6}
                      title="🧪 Testing Your API"
                      description="Test your API endpoints using curl, Postman, or your browser. Here are some example requests."
                      additionalContent={
                        <div className="space-y-4">
                          <CodeDisplay
                            code={`# Test GET endpoint
curl http://localhost:3000/api/users

# Test POST endpoint
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice Johnson", "email": "alice@example.com"}'

# Test with JavaScript fetch
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Bob Wilson',
    email: 'bob@example.com'
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
                            language="bash"
                            showLineNumbers={true}
                          />
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={7}
                      title="🔧 Next Steps & Best Practices"
                      description="Now that you have a basic API, here are some important concepts to learn next."
                      additionalContent={
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">•</span>
                            <span><strong>Input Validation:</strong> Always validate and sanitize user input</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">•</span>
                            <span><strong>Error Handling:</strong> Implement proper error handling and logging</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">•</span>
                            <span><strong>Database Integration:</strong> Replace in-memory storage with a real database</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">•</span>
                            <span><strong>Authentication:</strong> Add user authentication and authorization</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">•</span>
                            <span><strong>Environment Variables:</strong> Use .env files for configuration</span>
                          </div>
                        </div>
                      }
                      links={[
                        {
                          text: "Express.js Tutorial",
                          href: "#",
                          external: true
                        },
                        {
                          text: "Node.js Documentation",
                          href: "https://nodejs.org/docs",
                          external: true
                        },
                        {
                          text: "HTTP Status Codes",
                          href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
                          external: true
                        }
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Exercise' && (
              <div className="space-y-8">
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-8">
                    <StepCard
                      stepNumber={1}
                      title="🎯 Exercise: Build a Hello World Server"
                      description="Your task is to create a simple Node.js HTTP server that returns 'Hello, World!' when accessed. This exercise will test your understanding of basic HTTP server creation."
                      additionalContent={
                        <div className="space-y-4">
                          <div className="bg-tactical-surface p-4 rounded-lg border border-tactical-border-primary">
                            <h4 className="font-semibold mb-3 text-tactical-text-primary">Task Requirements:</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <span className="text-tactical-primary mt-1">•</span>
                                <span>Create an HTTP server using Node.js built-in <code className="bg-neutral-900 px-1 rounded text-xs">http</code> module</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-tactical-primary mt-1">•</span>
                                <span>Server should listen on port 3000</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-tactical-primary mt-1">•</span>
                                <span>Handle GET requests to the root path <code className="bg-neutral-900 px-1 rounded text-xs">/</code></span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-tactical-primary mt-1">•</span>
                                <span>Return JSON response: <code className="bg-neutral-900 px-1 rounded text-xs">{'{ "message": "Hello, World!" }'}</code></span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-tactical-primary mt-1">•</span>
                                <span>Set proper Content-Type header to <code className="bg-neutral-900 px-1 rounded text-xs">application/json</code></span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={2}
                      title="📋 Test Cases"
                      description="Test your server with these scenarios to ensure it works correctly."
                      additionalContent={
                        <div className="space-y-4">
                          <div className="test-case-card-tactical">
                            <h4 className="font-semibold text-tactical-text-primary mb-3 font-tactical">Test Case 1: Basic GET Request</h4>
                            <div className="space-y-4">
                              <div>
                                <span className="text-sm font-medium text-tactical-text-secondary font-tactical mb-2 block">Request (Postman):</span>
                                <div className="bg-neutral-900 rounded-lg border border-tactical-border-primary overflow-hidden">
                                  {/* Postman Header */}
                                  <div className="bg-tactical-surface px-4 py-2 border-b border-tactical-border-primary">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full bg-tactical-error"></div>
                                      <div className="w-3 h-3 rounded-full bg-tactical-warning"></div>
                                      <div className="w-3 h-3 rounded-full bg-tactical-success"></div>
                                      <span className="text-xs text-tactical-text-secondary ml-2">Postman</span>
                                    </div>
                                  </div>
                                  {/* Request URL */}
                                  <div className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <select className="bg-tactical-surface text-tactical-text-primary text-sm px-2 py-1 rounded border border-tactical-border-primary">
                                        <option>GET</option>
                                      </select>
                                      <input 
                                        type="text" 
                                        value="http://localhost:3000/" 
                                        readOnly
                                        className="flex-1 bg-tactical-surface text-tactical-text-primary text-sm px-3 py-1 rounded border border-tactical-border-primary"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-tactical-text-secondary font-tactical mb-2 block">Response (Postman):</span>
                                <div className="bg-neutral-900 rounded-lg border border-tactical-border-primary overflow-hidden">
                                  {/* Response Header */}
                                  <div className="bg-tactical-surface px-4 py-2 border-b border-tactical-border-primary">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-tactical-text-secondary">Response</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-green-400 font-semibold">200 OK</span>
                                        <span className="text-xs text-tactical-text-secondary">•</span>
                                        <span className="text-xs text-tactical-text-secondary">127ms</span>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Response Body */}
                                  <div className="p-4">
                                    <div className="bg-neutral-950 rounded border border-tactical-border-primary p-3">
                                      <pre className="text-sm text-tactical-text-primary font-mono">
{`{
  "message": "Hello, World!"
}`}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-tactical-text-secondary font-tactical">Explanation:</span>
                                <span className="text-sm text-tactical-text-secondary font-tactical">The server should respond with a 200 status and return the expected JSON message for the root path.</span>
                              </div>
                            </div>
                          </div>

                          <div className="test-case-card-tactical">
                            <h4 className="font-semibold text-tactical-text-primary mb-3 font-tactical">Test Case 2: Wrong Path</h4>
                            <div className="space-y-4">
                              <div>
                                <span className="text-sm font-medium text-tactical-text-secondary font-tactical mb-2 block">Request (Postman):</span>
                                <div className="bg-neutral-900 rounded-lg border border-tactical-border-primary overflow-hidden">
                                  {/* Postman Header */}
                                  <div className="bg-tactical-surface px-4 py-2 border-b border-tactical-border-primary">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full bg-tactical-error"></div>
                                      <div className="w-3 h-3 rounded-full bg-tactical-warning"></div>
                                      <div className="w-3 h-3 rounded-full bg-tactical-success"></div>
                                      <span className="text-xs text-tactical-text-secondary ml-2">Postman</span>
                                    </div>
                                  </div>
                                  {/* Request URL */}
                                  <div className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <select className="bg-tactical-surface text-tactical-text-primary text-sm px-2 py-1 rounded border border-tactical-border-primary">
                                        <option>GET</option>
                                      </select>
                                      <input 
                                        type="text" 
                                        value="http://localhost:3000/hello" 
                                        readOnly
                                        className="flex-1 bg-tactical-surface text-tactical-text-primary text-sm px-3 py-1 rounded border border-tactical-border-primary"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-tactical-text-secondary font-tactical mb-2 block">Response (Postman):</span>
                                <div className="bg-neutral-900 rounded-lg border border-tactical-border-primary overflow-hidden">
                                  {/* Response Header */}
                                  <div className="bg-tactical-surface px-4 py-2 border-b border-tactical-border-primary">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-tactical-text-secondary">Response</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-red-400 font-semibold">404 Not Found</span>
                                        <span className="text-xs text-tactical-text-secondary">•</span>
                                        <span className="text-xs text-tactical-text-secondary">45ms</span>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Response Body */}
                                  <div className="p-4">
                                    <div className="bg-neutral-950 rounded border border-tactical-border-primary p-3">
                                      <pre className="text-sm text-tactical-text-primary font-mono">
{`{
  "error": "Not Found"
}`}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-tactical-text-secondary font-tactical">Explanation:</span>
                                <span className="text-sm text-tactical-text-secondary font-tactical">The server should return a 404 status for any path that is not the root path.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    />

                    <StepCard
                      stepNumber={3}
                      title="💡 Hints"
                      description="Need help? Here are some hints to guide you."
                      additionalContent={
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">💡</span>
                            <span>Use <code className="bg-neutral-900 px-1 rounded text-xs">http.createServer()</code> to create your server</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">💡</span>
                            <span>Check <code className="bg-neutral-900 px-1 rounded text-xs">req.url</code> to determine the requested path</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">💡</span>
                            <span>Use <code className="bg-neutral-900 px-1 rounded text-xs">res.writeHead()</code> to set status and headers</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">💡</span>
                            <span>Use <code className="bg-neutral-900 px-1 rounded text-xs">JSON.stringify()</code> to convert objects to JSON</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-tactical-primary mt-1">💡</span>
                            <span>Don't forget to call <code className="bg-neutral-900 px-1 rounded text-xs">res.end()</code> to send the response</span>
                          </div>
                        </div>
                      }
                      links={[
                        {
                          text: "Node.js HTTP Documentation",
                          href: "https://nodejs.org/api/http.html",
                          external: true
                        },
                        {
                          text: "HTTP Status Codes",
                          href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
                          external: true
                        }
                      ]}
                    />
                  </div>
                </div>
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
