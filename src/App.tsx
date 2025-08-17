import { useState } from "react";
import CodeEditor from "./components/Editor";

export default function App() {
  const [code, setCode] = useState("");
  return (
    <div className="app">
      <CodeEditor code={code} runCode={setCode} />
    </div>
  );
}
