import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCode, 
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { faPython, faJava, faJs } from "@fortawesome/free-brands-svg-icons";

interface FileTab {
  id: string;
  name: string;
  language: string;
  content: string;
  isActive: boolean;
}

interface Props {
  code: string;
  onCodeChange: (code: string) => void;
  testCases: string;
  solution?: string;
  runCode?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ code, onCodeChange, testCases, solution, runCode, readOnly }: Props) {
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
      content: testCases,
      isActive: false
    }
  ]);

  const [showSolution, setShowSolution] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const [serverSolutionState, setServerSolutionState] = useState(false); // track solution state for server tab
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selectionInfo, setSelectionInfo] = useState('');

  // Update files when props change
  useEffect(() => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === 'server.js' 
          ? { ...file, content: code }
          : file.id === 'test-cases.js'
          ? { ...file, content: testCases }
          : file
      )
    );
  }, [code, testCases]);

  const activeFile = files.find(file => file.isActive) || files[0];

  const handleTabClick = (fileId: string) => {
    // Save current solution state if we're on server tab
    if (activeFile.id === 'server.js') {
      setServerSolutionState(showSolution);
    }
    
    setFiles(files.map(file => ({
      ...file,
      isActive: file.id === fileId
    })));
    
    // Update solution visibility based on the new tab
    if (fileId === 'server.js') {
      setShowSolution(serverSolutionState);
    } else {
      setShowSolution(false);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newValue = value || "";
    
    // Update the files state
    setFiles(files.map(file => 
      file.isActive 
        ? { ...file, content: newValue }
        : file
    ));

    // If the active file is server.js, call onCodeChange
    if (activeFile.id === 'server.js') {
      onCodeChange(newValue);
    }
  };

  const handleShowSolution = () => {
    const newState = !showSolution;
    setShowSolution(newState);
    setServerSolutionState(newState);
  };

  const handleSplitDrag = (e: React.MouseEvent) => {
    const container = e.currentTarget.parentElement;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPosition(Math.max(20, Math.min(80, newPosition)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getFileIcon = (language: string) => {
    switch (language) {
      case 'javascript':
        return <FontAwesomeIcon icon={faJs} className="text-yellow-400" />;
      case 'python':
        return <FontAwesomeIcon icon={faPython} className="text-blue-500" />;
      case 'java':
        return <FontAwesomeIcon icon={faJava} className="text-red-500" />;
      case 'json':
        return <FontAwesomeIcon icon={faFileCode} className="text-green-400" />;
      default:
        return <FontAwesomeIcon icon={faFile} className="text-gray-400" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-tactical-background min-h-0">
      {/* Tabs Bar */}
      <div className="w-full flex items-center bg-tactical-surface border-b border-tactical-border-primary h-12 flex-shrink-0">
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
      <div className="flex items-center justify-between px-4 h-12 bg-tactical-surface border-b border-tactical-border-primary flex-shrink-0">
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

      {/* Split Editor Container */}
      <div className="flex-1 relative min-h-0 flex">
        {/* Main Editor */}
        <div 
          className="relative min-h-0"
          style={{ width: (showSolution && activeFile.id === 'server.js') ? `${splitPosition}%` : '100%' }}
        >
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
              fixedOverflowWidgets: true,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              overviewRulerLanes: 0,
              lineDecorationsWidth: 20,
              glyphMargin: false,
              folding: false, // Disable folding for better performance
              lineNumbersMinChars: 3,
              renderLineHighlight: 'line', // Changed from 'all' to 'line' for better performance
              selectOnLineNumbers: true,
              wordWrap: 'on',
              wrappingStrategy: 'advanced',
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              tabCompletion: 'on',
              wordBasedSuggestions: 'off', // Disable word-based suggestions for better performance
              parameterHints: {
                enabled: false, // Disable parameter hints for better performance
              },
              autoIndent: 'full',
              formatOnPaste: false, // Disable format on paste for better performance
              formatOnType: false, // Disable format on type for better performance
              dragAndDrop: false, // Disable drag and drop for better performance
              links: false, // Disable links for better performance
              colorDecorators: false, // Disable color decorators for better performance
              bracketPairColorization: {
                enabled: true,
              },
              guides: {
                bracketPairs: true,
                indentation: false, // Disable indentation guides for better performance
              },
              renderWhitespace: 'none', // Changed from 'selection' to 'none' for better performance
              cursorBlinking: 'blink', // Changed from 'smooth' to 'blink' for better performance
              smoothScrolling: false, // Disable smooth scrolling for better performance
              mouseWheelScrollSensitivity: 1,
              fastScrollSensitivity: 5,
              padding: {
                top: 8,
                bottom: 8,
              },
              // Additional performance optimizations
              contextmenu: true,
              quickSuggestions: {
                other: true,
                comments: false,
                strings: false,
              },
              hover: {
                enabled: false, // Disable hover for better performance
              },
            }}
            theme="vs-dark"
            className="rounded-none"
            onMount={(editor) => {
              editor.focus();
              
              // Track cursor position changes
              editor.onDidChangeCursorPosition((e: any) => {
                setCursorPosition({
                  line: e.position.lineNumber,
                  column: e.position.column
                });
              });
              
              // Track selection changes
              editor.onDidChangeCursorSelection((e: any) => {
                const selection = e.selection;
                if (selection.startLineNumber === selection.endLineNumber && 
                    selection.startColumn === selection.endColumn) {
                  setSelectionInfo('');
                } else {
                  const lines = selection.endLineNumber - selection.startLineNumber + 1;
                  const chars = selection.endColumn - selection.startColumn;
                  setSelectionInfo(` ${lines} lines, ${chars} chars`);
                }
              });
            }}
          />
        </div>

        {/* Split Resizer */}
        {showSolution && activeFile.id === 'server.js' && (
          <div 
            className="w-1 bg-tactical-border-primary cursor-col-resize hover:bg-tactical-primary transition-colors relative"
            onMouseDown={handleSplitDrag}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-8 bg-tactical-border-primary rounded-full"></div>
            </div>
          </div>
        )}

        {/* Solution Editor */}
        {showSolution && solution && activeFile.id === 'server.js' && (
          <div 
            className="relative min-h-0 border-l border-tactical-border-primary"
            style={{ width: `${100 - splitPosition}%` }}
          >
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={solution}
              options={{ 
                readOnly: true,
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
                fixedOverflowWidgets: true,
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                overviewRulerLanes: 0,
                lineDecorationsWidth: 20,
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
                wordBasedSuggestions: 'allDocuments',
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
            />
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-tactical-surface border-t border-tactical-border-primary text-xs text-tactical-text-secondary font-tactical flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}{selectionInfo}</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="capitalize">{activeFile.language}</span>
          <div className="status-active"></div>
        </div>
      </div>

      {!readOnly && runCode && (
        <div className="flex justify-between items-center p-4 bg-tactical-surface border-t border-tactical-border-primary">
          <div className="flex items-center space-x-2">
            {solution && activeFile.id === 'server.js' && (
              <button 
                onClick={handleShowSolution}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  showSolution 
                    ? 'bg-tactical-error text-white hover:bg-red-600' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
