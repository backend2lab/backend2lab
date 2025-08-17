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
    <div className="editor">
      <Editor
        height="300px"
        defaultLanguage="javascript"
        value={currentCode}
        onChange={(value) => setCurrentCode(value || "")}
        options={{ readOnly: readOnly || false }}
      />

      {!readOnly && runCode && (
        <button onClick={() => runCode(currentCode)}>Run Code</button>
      )}
    </div>
  );
}
