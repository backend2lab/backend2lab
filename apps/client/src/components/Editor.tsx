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
    <div className="w-full h-full flex flex-col bg-tactical-background">
      {/* Tabs Bar */}
      <div className="w-full flex items-center bg-tactical-surface border-b border-tactical-border-primary h-12">
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
      <div className="flex items-center justify-between px-4 h-12 bg-tactical-surface border-b border-tactical-border-primary">
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
                'editor.selectionBackground': '#404040',
                'editor.inactiveSelectionBackground': '#404040',
                'editorCursor.foreground': '#ffffff',
                'editorWhitespace.foreground': '#404040',
                'editorIndentGuide.background': '#404040',
                'editorIndentGuide.activeBackground': '#737373',
                'editorLineNumber.foreground': '#737373',
                'editorLineNumber.activeForeground': '#ffffff',
                'editorGutter.background': '#000000',
                'editorError.foreground': '#ef4444',
                'editorWarning.foreground': '#f59e0b',
                'editorInfo.foreground': '#3b82f6',
                'editorBracketMatch.background': '#404040',
                'editorBracketMatch.border': '#737373',
              }
            });
          }}
          onMount={(editor) => {
            // Set the custom theme
            editor.updateOptions({
              theme: 'tactical-dark'
            });
            
            // Focus the editor
            editor.focus();
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-tactical-surface border-t border-tactical-border-primary text-xs text-tactical-text-secondary font-tactical">
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="capitalize">{activeFile.language}</span>
          <div className="status-active"></div>
        </div>
      </div>

      {!readOnly && runCode && (
        <div className="flex justify-end p-4 bg-tactical-surface border-t border-tactical-border-primary">
          <button 
            onClick={() => runCode(activeFile.content)}
            className="btn-tactical-primary"
          >
            Run Code
          </button>
        </div>
      )}
    </div>
  );
}
