import Editor from "@monaco-editor/react";
import { useMemo } from "react";

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
  // Ensure code is a string
  const safeCode = typeof code === 'string' ? code : String(code || '');
  
  // Generate a unique ID for this editor instance to ensure complete isolation
  const editorId = useMemo(() => `code-display-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Calculate height based on number of lines
  const lineCount = safeCode.split('\n').length;
  const lineHeight = 22; // matches fontSize 13 with lineHeight 22
  const padding = 16; // 8px top + 8px bottom
  const minHeight = 60; // minimum height for very short code
  const calculatedHeight = Math.max(minHeight, (lineCount * lineHeight) + padding);

  return (
    <div className={`bg-neutral-900 rounded-lg overflow-hidden border border-tactical-border-primary my-3 ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-tactical-surface border-b border-tactical-border-primary">
        <span className="text-sm text-tactical-text-secondary font-mono">
          {language}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(safeCode)}
          className="h-6 w-6 p-0 text-tactical-text-secondary hover:text-tactical-text-primary transition-colors"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      <div style={{ height: `${calculatedHeight}px` }}>
        <Editor
          key={editorId}
          height="100%"
          defaultLanguage={language}
          value={safeCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 22,
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
            lineDecorationsWidth: 20,
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
            cursorBlinking: 'blink',
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
    </div>
  );
}
