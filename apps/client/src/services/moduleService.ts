export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  tags: string[];
  files: {
    lab: {
      readme: string;
    };
    exercise: {
      readme: string;
      server: string;
      test: string;
      solution: string;
      package: string;
    };
  };
  learningObjectives: string[];
  prerequisites: string[];
}

export interface ModuleContent {
  module: Module;
  labContent: string;
  exerciseContent: {
    readme: string;
    editorFiles: {
      server: string;
      test: string;
      package: string;
    };
    solution: string;
  };
}

export interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  expected?: any;
  actual?: any;
}

export interface TestSuiteResult {
  moduleId: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
  executionTime: number;
}

const API_BASE_URL = 'http://localhost:4000/api';

export class ModuleService {
  static async getAllModules(): Promise<Module[]> {
    const response = await fetch(`${API_BASE_URL}/modules`);
    if (!response.ok) {
      throw new Error(`Failed to fetch modules: ${response.statusText}`);
    }
    return response.json();
  }

  static async getModuleContent(moduleId: string): Promise<ModuleContent> {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch module content: ${response.statusText}`);
    }
    return response.json();
  }

  static async runTests(moduleId: string, code: string): Promise<TestSuiteResult> {
    const response = await fetch(`${API_BASE_URL}/test/${moduleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to run tests: ${response.statusText}`);
    }
    
    return response.json();
  }
}
