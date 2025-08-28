import { TestRunner } from './testRunner';
import { writeFileSync, existsSync } from 'fs';
import { spawn } from 'child_process';
import { promisify } from 'util';

// Mock fs and child_process modules
jest.mock('fs');
jest.mock('child_process');
jest.mock('util');

const mockWriteFileSync = writeFileSync as jest.MockedFunction<typeof writeFileSync>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
const mockPromisify = promisify as jest.MockedFunction<typeof promisify>;

describe('TestRunner', () => {
  let mockServerProcess: any;
  let mockExecAsync: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock process
    mockServerProcess = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn(),
      kill: jest.fn()
    };
    
    mockSpawn.mockReturnValue(mockServerProcess);
    
    // Setup mock exec
    mockExecAsync = jest.fn();
    mockPromisify.mockReturnValue(mockExecAsync);
  });

  describe('runCode', () => {
    it('should successfully run code and start server', async () => {
      const moduleId = 'module-1';
      const inputCode = 'const express = require("express");\nconst app = express();\napp.listen(3000, () => console.log("Server running"));';
      
      mockExistsSync.mockReturnValue(true);
      
      // Mock successful server startup
      mockServerProcess.stdout.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('Server running on port 3000'));
        }
      });

      const result = await TestRunner.runCode(moduleId, inputCode);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        expect.stringContaining('module-1/exercise/server.js'),
        inputCode
      );
      expect(mockSpawn).toHaveBeenCalledWith('node', [expect.stringContaining('server.js')]);
      expect(result).toEqual({
        moduleId: 'module-1',
        success: true,
        message: 'Server started successfully',
        executionTime: expect.any(Number),
        serverOutput: 'Server running on port 3000'
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });

    it('should handle module not found', async () => {
      const moduleId = 'non-existent';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(false);

      const result = await TestRunner.runCode(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'non-existent',
        success: false,
        message: 'Module non-existent not found',
        executionTime: expect.any(Number)
      });
      expect(mockSpawn).not.toHaveBeenCalled();
    });

    it('should handle server startup timeout', async () => {
      const moduleId = 'module-1';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(true);
      
      // Mock timeout scenario
      mockServerProcess.stdout.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          // Don't call callback to simulate timeout
        }
      });

      const result = await TestRunner.runCode(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'module-1',
        success: false,
        message: 'Server failed to start',
        executionTime: expect.any(Number),
        error: 'Server startup timeout',
        serverOutput: ''
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });

    it('should handle port already in use error', async () => {
      const moduleId = 'module-1';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(true);
      
      mockServerProcess.stderr.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('EADDRINUSE: address already in use'));
        }
      });

      const result = await TestRunner.runCode(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'module-1',
        success: false,
        message: 'Server failed to start',
        executionTime: expect.any(Number),
        error: 'Port already in use',
        serverOutput: 'EADDRINUSE: address already in use'
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });

    it('should handle spawn error', async () => {
      const moduleId = 'module-1';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(true);
      
      mockServerProcess.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          callback(new Error('Spawn failed'));
        }
      });

      const result = await TestRunner.runCode(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'module-1',
        success: false,
        message: 'Server failed to start',
        executionTime: expect.any(Number),
        error: 'Spawn failed',
        serverOutput: ''
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });
  });

  describe('runTests', () => {
    it('should successfully run tests and return results', async () => {
      const moduleId = 'module-1';
      const inputCode = 'const express = require("express");\nconst app = express();\napp.listen(3000, () => console.log("Server running"));';
      
      mockExistsSync.mockReturnValue(true);
      
      // Mock successful server startup
      mockServerProcess.stdout.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('Server running on port 3000'));
        }
      });

      // Mock successful test execution
      const mockTestOutput = {
        passes: [
          { title: 'should start server' },
          { title: 'should respond to requests' }
        ],
        failures: [
          { 
            title: 'should have correct port',
            err: { message: 'expected 3000 to equal 8080' }
          }
        ]
      };
      
      mockExecAsync.mockResolvedValue({
        stdout: JSON.stringify(mockTestOutput),
        stderr: ''
      });

      const result = await TestRunner.runTests(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'module-1',
        totalTests: 3,
        passedTests: 2,
        failedTests: 1,
        results: [
          { testName: 'should start server', passed: true },
          { testName: 'should respond to requests', passed: true },
          { 
            testName: 'should have correct port', 
            passed: false, 
            error: 'expected 3000 to equal 8080',
            expected: 3000,
            actual: undefined
          }
        ],
        executionTime: expect.any(Number)
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });

    it('should handle module not found', async () => {
      const moduleId = 'non-existent';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(false);

      const result = await TestRunner.runTests(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'non-existent',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        results: [{
          testName: 'Module Setup',
          passed: false,
          error: 'Module non-existent not found'
        }],
        executionTime: expect.any(Number)
      });
      expect(mockSpawn).not.toHaveBeenCalled();
    });

    it('should handle test execution errors', async () => {
      const moduleId = 'module-1';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(true);
      
      mockServerProcess.stdout.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('Server running on port 3000'));
        }
      });

      // Mock test execution failure
      mockExecAsync.mockRejectedValue(new Error('Test execution failed'));

      const result = await TestRunner.runTests(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'module-1',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        results: [{
          testName: 'Test Execution',
          passed: false,
          error: 'Test execution failed: Test execution failed'
        }],
        executionTime: expect.any(Number)
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });

    it('should handle server startup failure', async () => {
      const moduleId = 'module-1';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(true);
      
      // Mock server startup failure
      mockServerProcess.stdout.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          // Don't call callback to simulate timeout
        }
      });

      const result = await TestRunner.runTests(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'module-1',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        results: [{
          testName: 'Server Setup',
          passed: false,
          error: 'Server setup failed: Server startup timeout'
        }],
        executionTime: expect.any(Number)
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });

    it('should handle malformed test output', async () => {
      const moduleId = 'module-1';
      const inputCode = 'console.log("test");';
      
      mockExistsSync.mockReturnValue(true);
      
      mockServerProcess.stdout.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('Server running on port 3000'));
        }
      });

      // Mock malformed test output
      mockExecAsync.mockRejectedValue(new Error('Unexpected token \'i\', "invalid json" is not valid JSON'));

      const result = await TestRunner.runTests(moduleId, inputCode);

      expect(result).toEqual({
        moduleId: 'module-1',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        results: [{
          testName: 'Test Execution',
          passed: false,
          error: 'Test execution failed: Unexpected token \'i\', "invalid json" is not valid JSON'
        }],
        executionTime: expect.any(Number)
      });
      expect(mockServerProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });
  });

  describe('parseMochaResults', () => {
    it('should parse mocha results correctly', () => {
      const mockMochaOutput = {
        passes: [
          { title: 'Test 1' },
          { title: 'Test 2' }
        ],
        failures: [
          { 
            title: 'Test 3',
            err: { message: 'expected 1 to equal 2' }
          },
          {
            title: 'Test 4',
            err: { message: 'expected "hello" to equal "world"' }
          }
        ]
      };

      // Access the private method through the class
      const result = (TestRunner as any).parseMochaResults(mockMochaOutput);

      expect(result).toEqual([
        { testName: 'Test 1', passed: true },
        { testName: 'Test 2', passed: true },
        { 
          testName: 'Test 3', 
          passed: false, 
          error: 'expected 1 to equal 2',
          expected: 1,
          actual: undefined
        },
        { 
          testName: 'Test 4', 
          passed: false, 
          error: 'expected "hello" to equal "world"',
          expected: 'hello',
          actual: undefined
        }
      ]);
    });

    it('should handle mocha output with no tests', () => {
      const mockMochaOutput = {
        passes: [],
        failures: []
      };

      const result = (TestRunner as any).parseMochaResults(mockMochaOutput);

      expect(result).toEqual([]);
    });

    it('should handle mocha output with only passes', () => {
      const mockMochaOutput = {
        passes: [
          { title: 'Test 1' },
          { title: 'Test 2' }
        ],
        failures: []
      };

      const result = (TestRunner as any).parseMochaResults(mockMochaOutput);

      expect(result).toEqual([
        { testName: 'Test 1', passed: true },
        { testName: 'Test 2', passed: true }
      ]);
    });

    it('should handle mocha output with only failures', () => {
      const mockMochaOutput = {
        passes: [],
        failures: [
          { 
            title: 'Test 1',
            err: { message: 'Test failed' }
          }
        ]
      };

      const result = (TestRunner as any).parseMochaResults(mockMochaOutput);

      expect(result).toEqual([
        { 
          testName: 'Test 1', 
          passed: false, 
          error: 'Test failed'
        }
      ]);
    });
  });

  describe('killProcessOnPort', () => {
    it('should kill process on port successfully', async () => {
      const mockExecAsync = jest.fn();
      mockPromisify.mockReturnValue(mockExecAsync);
      
      // Mock finding process on port
      mockExecAsync
        .mockResolvedValueOnce({ stdout: '12345' }) // lsof command
        .mockResolvedValueOnce({ stdout: '' }); // kill command

      await (TestRunner as any).killProcessOnPort(3000);

      expect(mockExecAsync).toHaveBeenCalledTimes(2);
      expect(mockExecAsync).toHaveBeenCalledWith('lsof -ti:3000');
      expect(mockExecAsync).toHaveBeenCalledWith('kill -9 12345');
    });

    it('should handle no process found on port', async () => {
      const mockExecAsync = jest.fn();
      mockPromisify.mockReturnValue(mockExecAsync);
      
      // Mock no process found
      mockExecAsync.mockRejectedValue(new Error('No process found'));

      await (TestRunner as any).killProcessOnPort(3000);

      expect(mockExecAsync).toHaveBeenCalledWith('lsof -ti:3000');
    });
  });
});
