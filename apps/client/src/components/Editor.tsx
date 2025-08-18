import { useState } from "react";
import Editor from "@monaco-editor/react";

interface Props {
  code: string;
  runCode?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ code, runCode, readOnly }: Props) {
  const [currentCode, setCurrentCode] = useState<string>(code);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-dark-border-primary">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-dark-text-secondary">main.js</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-error-500"></div>
            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
            <div className="w-3 h-3 rounded-full bg-success-500"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-dark-text-tertiary">JavaScript</span>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={currentCode}
          onChange={(value) => setCurrentCode(value || "")}
          options={{ 
            readOnly: readOnly || false,
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
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
          beforeMount={(monaco) => {
            // Customize the dark theme
            monaco.editor.defineTheme('leetcode-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'operator', foreground: 'D4D4D4' },
                { token: 'function', foreground: 'DCDCAA' },
                { token: 'variable', foreground: '9CDCFE' },
                { token: 'type', foreground: '4EC9B0' },
              ],
              colors: {
                'editor.background': '#1E1E1E',
                'editor.foreground': '#D4D4D4',
                'editor.lineHighlightBackground': '#2A2D2E',
                'editor.selectionBackground': '#264F78',
                'editor.inactiveSelectionBackground': '#3A3D41',
                'editorCursor.foreground': '#AEAFAD',
                'editorWhitespace.foreground': '#3E3E3E',
                'editorIndentGuide.background': '#404040',
                'editorIndentGuide.activeBackground': '#707070',
                'editorLineNumber.foreground': '#858585',
                'editorLineNumber.activeForeground': '#C6C6C6',
                'editorGutter.background': '#1E1E1E',
                'editorError.foreground': '#F44747',
                'editorWarning.foreground': '#CCA700',
                'editorInfo.foreground': '#75BEFF',
                'editorBracketMatch.background': '#0064001A',
                'editorBracketMatch.border': '#888888',
              }
            });
          }}
          onMount={(editor) => {
            // Set the custom theme
            editor.updateOptions({
              theme: 'leetcode-dark'
            });
            
            // Focus the editor
            editor.focus();
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-dark-border-primary text-xs text-dark-text-tertiary">
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>JavaScript</span>
          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
        </div>
      </div>

      {!readOnly && runCode && (
        <div className="flex justify-end p-4 bg-dark-card border-t border-dark-border-primary">
          <button 
            onClick={() => runCode(currentCode)}
            className="btn-primary"
          >
            Run Code
          </button>
        </div>
      )}
    </div>
  );
}
