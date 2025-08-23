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

export class TestRunner {

}
