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
      id: 'main.js',
      name: 'main.js',
      language: 'javascript',
      content: code,
      isActive: true
    },
    {
      id: 'solution.py',
      name: 'solution.py',
      language: 'python',
      content: `# Two Sum Solution
def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    """
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []

# Test the function
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # Expected: [0, 1]`,
      isActive: false
    },
    {
      id: 'Solution.java',
      name: 'Solution.java',
      language: 'java',
      content: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = solution.twoSum(nums, target);
        System.out.println(Arrays.toString(result)); // Expected: [0, 1]
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
      default:
        return '📄';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Tabs Bar */}
      <div className="tabby">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => handleTabClick(file.id)}
            className={`flex items-center space-x-2 px-4 h-full cursor-pointer border-r border-dark-border-primary flex-1 transition-colors ${
              file.isActive 
                ? 'bg-gray-900 text-dark-text-primary' 
                : 'bg-gray-800 text-dark-text-secondary hover:bg-gray-700 hover:text-dark-text-primary'
            }`}
          >
            <span className="text-sm">{getFileIcon(file.language)}</span>
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
        ))}
      </div>

      {/* Editor Header */}
      <div className="editor-tabs">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-dark-text-secondary">{activeFile.name}</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-error-500"></div>
            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
            <div className="w-3 h-3 rounded-full bg-success-500"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-dark-text-tertiary capitalize">{activeFile.language}</span>
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
          <span className="capitalize">{activeFile.language}</span>
          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
        </div>
      </div>

      {!readOnly && runCode && (
        <div className="flex justify-end p-4 bg-dark-card border-t border-dark-border-primary">
          <button 
            onClick={() => runCode(activeFile.content)}
            className="btn-primary"
          >
            Run Code
          </button>
        </div>
      )}
    </div>
  );
}
