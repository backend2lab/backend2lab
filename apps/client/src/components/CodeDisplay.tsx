import Editor from "@monaco-editor/react";

interface CodeDisplayProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeDisplay({ 
  code, 
  language, 
  showLineNumbers = true, 
  className = "" 
}: CodeDisplayProps) {
  // Calculate height based on number of lines
  const lineCount = code.split('\n').length;
  const lineHeight = 18; // matches fontSize 13 with lineHeight 18
  const padding = 16; // 8px top + 8px bottom
  const minHeight = 60; // minimum height for very short code
  const calculatedHeight = Math.max(minHeight, (lineCount * lineHeight) + padding);

  return (
    <div className={`bg-neutral-900 rounded-lg overflow-hidden border border-tactical-border-primary ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-tactical-surface border-b border-tactical-border-primary">
        <span className="text-sm text-tactical-text-secondary font-mono">
          {language}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="h-6 w-6 p-0 text-tactical-text-secondary hover:text-tactical-text-primary transition-colors"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      <div style={{ height: `${calculatedHeight}px` }}>
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 18,
            fontFamily: "'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
            lineNumbers: showLineNumbers ? "on" : "off",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            theme: "vs-dark",
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'auto',
              verticalScrollbarSize: 0,
              horizontalScrollbarSize: 8,
              useShadows: false,
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            lineDecorationsWidth: 10,
            glyphMargin: false,
            folding: false,
            wordWrap: 'on',
            wrappingStrategy: 'advanced',
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: false,
            },
            renderWhitespace: 'none',
            cursorBlinking: 'hidden',
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
            // Customize the dark theme for tactical design
            monaco.editor.defineTheme('tactical-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'DCDCAA', fontStyle: 'bold' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'operator', foreground: 'D4D4D4' },
                { token: 'function', foreground: 'DCDCAA' },
                { token: 'variable', foreground: '9CDCFE' },
                { token: 'type', foreground: '4EC9B0' },
              ],
              colors: {
                'editor.background': '#000000',
                'editor.foreground': '#ffffff',
                'editor.lineHighlightBackground': '#262626',
                'editor.selectionBackground': '#f97316',
                'editor.inactiveSelectionBackground': '#404040',
                'editorCursor.foreground': '#f97316',
                'editorWhitespace.foreground': '#404040',
                'editorIndentGuide.background': '#404040',
                'editorIndentGuide.activeBackground': '#737373',
                'editorLineNumber.foreground': '#737373',
                'editorLineNumber.activeForeground': '#ffffff',
                'editorGutter.background': '#000000',
                'editorError.foreground': '#ef4444',
                'editorWarning.foreground': '#f59e0b',
                'editorInfo.foreground': '#3b82f6',
                'editorBracketMatch.background': '#f97316',
                'editorBracketMatch.border': '#f97316',
              }
            });
          }}
          onMount={(editor) => {
            // Set the custom theme
            editor.updateOptions({
              theme: 'tactical-dark'
            });
          }}
        />
      </div>
    </div>
  );
}
