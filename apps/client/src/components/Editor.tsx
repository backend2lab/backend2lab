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
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={currentCode}
        onChange={(value) => setCurrentCode(value || "")}
        options={{ 
          readOnly: readOnly || false,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          theme: "vs-dark",
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          overviewRulerLanes: 0,
          lineDecorationsWidth: 0,
          glyphMargin: false,
          folding: false,
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
        }}
        theme="vs-dark"
        className="rounded-lg overflow-hidden"
      />

      {!readOnly && runCode && (
        <div className="mt-4 flex justify-end p-4 bg-dark-card border-t border-dark-border-primary">
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
