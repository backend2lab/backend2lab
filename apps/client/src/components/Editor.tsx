import { useState } from "react";
import Editor from "@monaco-editor/react";

interface FileTab {
  id: string;
  name: string;
  language: string;
  content: string;
  isActive: boolean;
}

interface Props {
  code: string;
  runCode?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ code, runCode, readOnly }: Props) {
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: 'server.js',
      name: 'server.js',
      language: 'javascript',
      content: code,
      isActive: true
    },
    {
      id: 'test-cases.js',
      name: 'test-cases.js',
      language: 'javascript',
      content: `// Test Cases for Hello World Server
// These are the test cases that your server should pass

const { expect } = require('chai');
const http = require('http');

// Utility function to make HTTP requests
function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

describe('Hello World Server', () => {
  it('should return 200 OK and correct JSON for GET /', async () => {
    const response = await makeRequest('GET', '/');
    
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal({ message: 'Hello, World!' });
    expect(response.headers['content-type']).to.include('application/json');
  });

  it('should return 404 for GET /hello', async () => {
    const response = await makeRequest('GET', '/hello');
    
    expect(response.statusCode).to.equal(404);
  });

  it('should return 404 for POST /', async () => {
    const response = await makeRequest('POST', '/');
    
    expect(response.statusCode).to.equal(404);
  });

  it('should return 404 for PUT /', async () => {
    const response = await makeRequest('PUT', '/');
    
    expect(response.statusCode).to.equal(404);
  });

  it('should return 404 for DELETE /', async () => {
    const response = await makeRequest('DELETE', '/');
    
    expect(response.statusCode).to.equal(404);
  });

  it('should return 404 for GET /api', async () => {
    const response = await makeRequest('GET', '/api');
    
    expect(response.statusCode).to.equal(404);
  });

  it('should return 404 for GET /users', async () => {
    const response = await makeRequest('GET', '/users');
    
    expect(response.statusCode).to.equal(404);
  });
});`,
      isActive: false
    },
    {
      id: 'package.json',
      name: 'package.json',
      language: 'json',
      content: `{
  "name": "hello-world-server",
  "version": "1.0.0",
  "description": "A simple Node.js HTTP server exercise",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "mocha test-cases.js",
    "dev": "node server.js"
  },
  "keywords": ["nodejs", "http", "server", "api"],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  },
  "devDependencies": {
    "mocha": "^10.2.0",
    "chai": "^4.3.7"
  }
}`,
      isActive: false
    }
  ]);

  const activeFile = files.find(file => file.isActive) || files[0];

  const handleTabClick = (fileId: string) => {
    setFiles(files.map(file => ({
      ...file,
      isActive: file.id === fileId
    })));
  };

  const handleCodeChange = (value: string | undefined) => {
    setFiles(files.map(file => 
      file.isActive 
        ? { ...file, content: value || "" }
        : file
    ));
  };

  const getFileIcon = (language: string) => {
    switch (language) {
      case 'javascript':
        return '⚡';
      case 'python':
        return '🐍';
      case 'java':
        return '☕';
      case 'json':
        return '📦';
      default:
        return '📄';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-tactical-background">
      {/* Tabs Bar */}
      <div className="w-full flex items-center bg-tactical-surface border-b border-tactical-border-primary h-12">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => handleTabClick(file.id)}
            className={`flex items-center space-x-2 px-4 h-full cursor-pointer border-r border-tactical-border-primary flex-1 transition-colors ${
              file.isActive 
                ? 'bg-tactical-background text-tactical-text-primary' 
                : 'bg-tactical-surface text-tactical-text-secondary hover:bg-neutral-800 hover:text-tactical-text-primary'
            }`}
          >
            <span className="text-sm font-tactical">{getFileIcon(file.language)}</span>
            <span className="text-sm font-medium truncate font-tactical">{file.name}</span>
          </div>
        ))}
      </div>

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 h-12 bg-tactical-surface border-b border-tactical-border-primary">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-tactical-text-secondary font-tactical">{activeFile.name}</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-tactical-error"></div>
            <div className="w-3 h-3 rounded-full bg-tactical-warning"></div>
            <div className="w-3 h-3 rounded-full bg-tactical-success"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-tactical-text-secondary capitalize font-tactical">{activeFile.language}</span>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage={activeFile.language}
          value={activeFile.content}
          onChange={handleCodeChange}
          options={{ 
            readOnly: readOnly || false,
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 20,
            fontFamily: "'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            theme: "vs-dark",
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              useShadows: false,
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            lineDecorationsWidth: 10,
            glyphMargin: false,
            folding: true,
            foldingStrategy: 'indentation',
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            wordWrap: 'on',
            wrappingStrategy: 'advanced',
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'on',
            parameterHints: {
              enabled: true,
              cycle: true,
            },
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            dragAndDrop: true,
            links: true,
            colorDecorators: true,
            lightbulb: {
              enabled: true,
            },
            codeActionsOnSave: {
              'source.fixAll': true,
              'source.organizeImports': true,
            },
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            renderWhitespace: 'selection',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            mouseWheelScrollSensitivity: 1,
            fastScrollSensitivity: 5,
            padding: {
              top: 8,
              bottom: 8,
            },
          }}
          theme="vs-dark"
          className="rounded-none"
          onMount={(editor) => {
            // Focus the editor
            editor.focus();
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-tactical-surface border-t border-tactical-border-primary text-xs text-tactical-text-secondary font-tactical">
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="capitalize">{activeFile.language}</span>
          <div className="status-active"></div>
        </div>
      </div>

      {!readOnly && runCode && (
        <div className="flex justify-end p-4 bg-tactical-surface border-t border-tactical-border-primary">
          <button 
            onClick={() => runCode(activeFile.content)}
            className="btn-tactical-primary"
          >
            Run Code
          </button>
        </div>
      )}
    </div>
  );
}
