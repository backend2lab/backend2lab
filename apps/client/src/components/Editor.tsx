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
    <div className="w-full">
      <Editor
        height="400px"
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
          theme: "vs-dark"
        }}
        theme="vs-dark"
      />

      {!readOnly && runCode && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => runCode(currentCode)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium border-none cursor-pointer transition-all duration-200 hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Run Code
          </button>
        </div>
      )}
    </div>
  );
}
