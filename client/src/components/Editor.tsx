import { useState, useEffect, useRef } from "react";
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
  hasAttemptedSubmit?: boolean;
}

export default function CodeEditor({
  code,
  onCodeChange,
  testCases,
  solution,
  runCode,
  readOnly,
  hasAttemptedSubmit
}: Props) {
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: "server.js",
      name: "server.js",
      language: "javascript",
      content: code,
      isActive: true,
    },
    {
      id: "test-cases.js",
      name: "test-cases.js",
      language: "javascript",
      content: testCases,
      isActive: false,
    },
  ]);

  const [showSolution, setShowSolution] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const [serverSolutionState, setServerSolutionState] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selectionInfo, setSelectionInfo] = useState("");

  // Keep a ref to the Monaco editor to force option updates
  const editorRef = useRef<any>(null);

  // Update files when props change
  useEffect(() => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === "server.js"
          ? { ...file, content: code }
          : file.id === "test-cases.js"
          ? { ...file, content: testCases }
          : file
      )
    );
  }, [code, testCases]);

  const activeFile = files.find((f) => f.isActive) || files[0];
  const isTestCasesTab = activeFile.id === "test-cases.js";
  const isServerTab = activeFile.id === "server.js";

  // Ensure readOnly flips reliably when switching tabs
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        readOnly: isTestCasesTab ? true : !!readOnly,
        domReadOnly: isTestCasesTab ? true : !!readOnly,
      });
    }
  }, [isTestCasesTab, readOnly]);

  const handleTabClick = (fileId: string) => {
    if (activeFile.id === "server.js") setServerSolutionState(showSolution);

    setFiles((prev) =>
      prev.map((file) => ({
        ...file,
        isActive: file.id === fileId,
      }))
    );

    if (fileId === "server.js") {
      setShowSolution(serverSolutionState);
    } else {
      setShowSolution(false);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    // Hard block edits in test-cases tab at the React layer
    if (isTestCasesTab) return;

    const newValue = value || "";
    setFiles((prev) =>
      prev.map((file) =>
        file.isActive ? { ...file, content: newValue } : file
      )
    );

    if (isServerTab) onCodeChange(newValue);
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
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getFileIcon = (language: string) => {
    switch (language) {
      case "javascript":
        return <FontAwesomeIcon icon={faJs} className="text-yellow-400" />;
      case "python":
        return <FontAwesomeIcon icon={faPython} className="text-blue-500" />;
      case "java":
        return <FontAwesomeIcon icon={faJava} className="text-red-500" />;
      case "json":
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
                ? "bg-tactical-background text-tactical-text-primary"
                : "bg-tactical-surface text-tactical-text-secondary hover:bg-neutral-800 hover:text-tactical-text-primary"
            }`}
          >
            <span className="text-sm font-tactical">
              {getFileIcon(file.language)}
            </span>
            <span className="text-sm font-medium truncate font-tactical">
              {file.name}
            </span>
          </div>
        ))}
      </div>

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 h-12 bg-tactical-surface border-b border-tactical-border-primary flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-tactical-text-secondary font-tactical">
            {activeFile.name}
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-tactical-error"></div>
            <div className="w-3 h-3 rounded-full bg-tactical-warning"></div>
            <div className="w-3 h-3 rounded-full bg-tactical-success"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-tactical-text-secondary capitalize font-tactical">
            {activeFile.language}
          </span>
        </div>
      </div>

      {/* Split Editor Container */}
      <div className="flex-1 relative min-h-0 flex">
        {/* Main Editor */}
        <div
          className="relative min-h-0"
          style={{
            width:
              showSolution && isServerTab ? `${splitPosition}%` : "100%",
          }}
        >
          <Editor
            key={activeFile.id} // force remount per tab to apply readOnly reliably
            height="100%"
            defaultLanguage={activeFile.language}
            value={activeFile.content}
            onChange={handleCodeChange}
            options={{
              readOnly: isTestCasesTab ? true : !!readOnly,
              domReadOnly: isTestCasesTab ? true : !!readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 24,
              fontFamily:
                "'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              theme: "vs-dark",
              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
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
              folding: false,
              lineNumbersMinChars: 3,
              renderLineHighlight: "line",
              selectOnLineNumbers: true,
              wordWrap: "on",
              wrappingStrategy: "advanced",
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
              tabCompletion: "on",
              wordBasedSuggestions: "off",
              parameterHints: { enabled: false },
              autoIndent: "full",
              formatOnPaste: false,
              formatOnType: false,
              dragAndDrop: false,
              links: false,
              colorDecorators: false,
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: false },
              renderWhitespace: "none",
              cursorBlinking: "blink",
              smoothScrolling: false,
              mouseWheelScrollSensitivity: 1,
              fastScrollSensitivity: 5,
              padding: { top: 8, bottom: 8 },
              contextmenu: true,
              quickSuggestions: { other: true, comments: false, strings: false },
              hover: { enabled: false },
            }}
            theme="vs-dark"
            className="rounded-none"
            onMount={(editor) => {
              editorRef.current = editor;

              // For safety: swallow any attempts if read-only
              editor.onDidAttemptReadOnlyEdit(() => {});

              editor.onDidChangeCursorPosition((e: any) => {
                setCursorPosition({
                  line: e.position.lineNumber,
                  column: e.position.column,
                });
              });

              editor.onDidChangeCursorSelection((e: any) => {
                const s = e.selection;
                if (
                  s.startLineNumber === s.endLineNumber &&
                  s.startColumn === s.endColumn
                ) {
                  setSelectionInfo("");
                } else {
                  const lines = s.endLineNumber - s.startLineNumber + 1;
                  const chars = s.endColumn - s.startColumn;
                  setSelectionInfo(` ${lines} lines, ${chars} chars`);
                }
              });

              // Ensure correct mode on first mount of each tab
              editor.updateOptions({
                readOnly: isTestCasesTab ? true : !!readOnly,
                domReadOnly: isTestCasesTab ? true : !!readOnly,
              });
            }}
          />
        </div>

        {/* Split Resizer */}
        {showSolution && isServerTab && (
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
        {showSolution && solution && isServerTab && (
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
                domReadOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 24,
                fontFamily:
                  "'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                theme: "vs-dark",
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
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
                foldingStrategy: "indentation",
                lineNumbersMinChars: 3,
                renderLineHighlight: "all",
                selectOnLineNumbers: true,
                wordWrap: "on",
                wrappingStrategy: "advanced",
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                tabCompletion: "on",
                wordBasedSuggestions: "allDocuments",
                parameterHints: { enabled: true, cycle: true },
                autoIndent: "full",
                formatOnPaste: true,
                formatOnType: true,
                dragAndDrop: true,
                links: true,
                colorDecorators: true,
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true, indentation: true },
                renderWhitespace: "selection",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                mouseWheelScrollSensitivity: 1,
                fastScrollSensitivity: 5,
                padding: { top: 8, bottom: 8 },
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
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
            {selectionInfo}
          </span>
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
            {solution && isServerTab && hasAttemptedSubmit && (
              <button
                onClick={handleShowSolution}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  showSolution
                    ? "bg-tactical-error text-white hover:bg-red-600"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
