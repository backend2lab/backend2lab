import { config } from '../config/env';

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
  expected?: unknown;
  actual?: unknown;
}

export interface TestSuiteResult {
  moduleId: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
  executionTime: number;
}

export interface RunResult {
  moduleId: string;
  success: boolean;
  message: string;
  executionTime: number;
  serverOutput?: string;
  error?: string;
  output?: string;
}

const API_BASE_URL = config.apiBaseUrl;

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

  static async runCode(moduleId: string, code: string): Promise<RunResult> {
    const response = await fetch(`${API_BASE_URL}/run/${moduleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to run code: ${response.statusText}`);
    }
    
    return response.json();
  }
}
