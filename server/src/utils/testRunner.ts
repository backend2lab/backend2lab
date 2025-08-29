import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { promisify } from 'util';

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

export interface RunResult {
  moduleId: string;
  success: boolean;
  message: string;
  executionTime: number;
  serverOutput?: string;
  error?: string;
}

export class TestRunner {
  static async runCode(moduleId: string, inputCode: string): Promise<RunResult> {
    const startTime = Date.now();
    let serverProcess: any = null;
    let serverOutput = '';

    try {
      // Get the module path
      const modulePath = join(process.cwd(), 'src/modules', moduleId);
      console.log(modulePath, 'module path-----')
      const serverFilePath = join(modulePath, 'exercise/server.js');

      // Check if module exists
      if (!existsSync(modulePath)) {
        return {
          moduleId,
          success: false,
          message: `Module ${moduleId} not found`,
          executionTime: Date.now() - startTime
        };
      }

      // Kill any existing processes on port 3000
      await this.killProcessOnPort(3000);

      // Write input code to server.js
      writeFileSync(serverFilePath, inputCode);
      
      serverProcess = spawn('node', [serverFilePath]);

      // Wait for server to start
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Server startup timeout'));
        }, 5000);

        serverProcess.stdout.on('data', (data: Buffer) => {
          const output = data.toString();
          serverOutput += output;
          if (output.includes('Server running') || output.includes('listening')) {
            clearTimeout(timeout);
            resolve();
          }
        });

        serverProcess.stderr.on('data', (data: Buffer) => {
          const error = data.toString();
          serverOutput += error;
          if (error.includes('EADDRINUSE')) {
            clearTimeout(timeout);
            reject(new Error('Port already in use'));
          }
        });

        serverProcess.on('error', (error: any) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      // Wait a bit more to ensure server is fully started
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        moduleId,
        success: true,
        message: 'Server started successfully',
        executionTime: Date.now() - startTime,
        serverOutput: serverOutput.trim()
      };

    } catch (error: any) {
      return {
        moduleId,
        success: false,
        message: 'Server failed to start',
        executionTime: Date.now() - startTime,
        error: error.message,
        serverOutput: serverOutput.trim()
      };
    } finally {
      // Clean up: kill the server process
      if (serverProcess) {
        serverProcess.kill('SIGTERM');
      }
    }
  }

  static async runTests(moduleId: string, inputCode: string): Promise<TestSuiteResult> {
    const startTime = Date.now();
    const results: TestResult[] = [];
    let serverProcess: any = null;

    try {
      // Get the module path
      const modulePath = join(process.cwd(), 'src/modules', moduleId);
      const serverFilePath = join(modulePath, 'exercise/server.js');

      // Check if module exists
      if (!existsSync(modulePath)) {
        return {
          moduleId,
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          results: [{
            testName: 'Module Setup',
            passed: false,
            error: `Module ${moduleId} not found`
          }],
          executionTime: Date.now() - startTime
        };
      }

      // Kill any existing processes on port 3000
      await this.killProcessOnPort(3000);

      // Write input code to server.js (no modifications needed)
      writeFileSync(serverFilePath, inputCode);
      
      serverProcess = spawn('node', [serverFilePath]);

      // Wait for server to start
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Server startup timeout'));
        }, 5000);

        serverProcess.stdout.on('data', (data: Buffer) => {
          const output = data.toString();
          if (output.includes('Server running') || output.includes('listening')) {
            clearTimeout(timeout);
            resolve();
          }
        });

        serverProcess.stderr.on('data', (data: Buffer) => {
          const error = data.toString();
          if (error.includes('EADDRINUSE')) {
            clearTimeout(timeout);
            reject(new Error('Port already in use'));
          }
        });

        serverProcess.on('error', (error: any) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      // Run the test file using mocha
      const testCommand = `cd ${process.cwd()} && npx mocha ${modulePath}/exercise/test.js --reporter json`;
      
      const { exec } = await import('child_process');
      const execAsync = promisify(exec);
      
      try {
        const { stdout, stderr } = await execAsync(testCommand, { timeout: 10000 });
        
        // Parse mocha JSON output
        const testOutput = JSON.parse(stdout);
        
        // Convert mocha results to our format
        results.push(...this.parseMochaResults(testOutput));
        
      } catch (execError: any) {
        // Handle test execution errors
        if (execError.stdout) {
          try {
            const testOutput = JSON.parse(execError.stdout);
            results.push(...this.parseMochaResults(testOutput));
          } catch (parseError) {
            results.push({
              testName: 'Test Execution',
              passed: false,
              error: `Failed to parse test results: ${execError.message}`
            });
          }
        } else {
          results.push({
            testName: 'Test Execution',
            passed: false,
            error: `Test execution failed: ${execError.message}`
          });
        }
      }

    } catch (error: any) {
      results.push({
        testName: 'Server Setup',
        passed: false,
        error: `Server setup failed: ${error.message}`
      });
    } finally {
      // Clean up: kill the server process
      if (serverProcess) {
        serverProcess.kill('SIGTERM');
      }
    }

    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed).length;

    return {
      moduleId,
      totalTests: results.length,
      passedTests,
      failedTests,
      results,
      executionTime: Date.now() - startTime
    };
  }

  private static parseMochaResults(mochaOutput: any): TestResult[] {
    const results: TestResult[] = [];

    // Handle passed tests
    if (mochaOutput.passes) {
      for (const test of mochaOutput.passes) {
        results.push({
          testName: test.title,
          passed: true
        });
      }
    }

    // Handle failed tests
    if (mochaOutput.failures) {
      for (const test of mochaOutput.failures) {
        const result: TestResult = {
          testName: test.title,
          passed: false,
          error: test.err?.message || 'Test failed'
        };

        // Try to extract expected/actual from error message
        if (test.err?.message) {
          const errorMsg = test.err.message;
          // Look for common assertion error patterns
          const expectedMatch = errorMsg.match(/expected\s+(.+?)\s+to/);
          const actualMatch = errorMsg.match(/got\s+(.+?)$/);
          
          if (expectedMatch) {
            try {
              result.expected = JSON.parse(expectedMatch[1]);
            } catch (e) {
              result.expected = expectedMatch[1];
            }
          }
          
          if (actualMatch) {
            try {
              result.actual = JSON.parse(actualMatch[1]);
            } catch (e) {
              result.actual = actualMatch[1];
            }
          }
        }

        results.push(result);
      }
    }

    return results;
  }

  private static async killProcessOnPort(port: number): Promise<void> {
    try {
      const { exec } = await import('child_process');
      const execAsync = promisify(exec);
      
      // Find processes using the port
      const findCommand = process.platform === 'win32' 
        ? `netstat -ano | findstr :${port}`
        : `lsof -ti:${port}`;
      
      const { stdout } = await execAsync(findCommand);
      
      if (stdout.trim()) {
        // Kill the processes
        const killCommand = process.platform === 'win32'
          ? `taskkill /F /PID ${stdout.trim()}`
          : `kill -9 ${stdout.trim()}`;
        
        await execAsync(killCommand);
        console.log(`Killed process on port ${port}`);
      }
    } catch (error) {
      // Ignore errors if no process is found or already killed
      console.log(`No process found on port ${port} or already killed`);
    }
  }
}
