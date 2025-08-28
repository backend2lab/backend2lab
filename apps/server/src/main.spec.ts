import request from 'supertest';
import express from 'express';
import { TestRunner } from './utils/testRunner';
import { getAllModules, getModuleContent } from './modules';

// Mock the dependencies
jest.mock('./utils/testRunner');
jest.mock('./modules', () => ({
  getAllModules: jest.fn(),
  getModuleContent: jest.fn()
}));

const mockTestRunner = TestRunner as jest.Mocked<typeof TestRunner>;
const mockGetAllModules = getAllModules as jest.MockedFunction<typeof getAllModules>;
const mockGetModuleContent = getModuleContent as jest.MockedFunction<typeof getModuleContent>;

// Create a test app instance
const createTestApp = () => {
  const app = express();
  
  // CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.use(express.json());

  app.get('/api/modules', (req, res) => {
    try {
      const modules = getAllModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load modules' });
    }
  });

  app.get('/api/modules/:moduleId', (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleContent = getModuleContent(moduleId);
      
      if (!moduleContent) {
        return res.status(404).json({ error: 'Module not found' });
      }
      
      res.json(moduleContent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load module content' });
    }
  });

  app.post('/api/test/:moduleId', async (req, res) => {
    try {
      const { moduleId } = req.params;
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }
      
      const testResult = await TestRunner.runTests(moduleId, code);
      res.json(testResult);
    } catch (error) {
      res.status(500).json({ error: 'Test execution failed' });
    }
  });

  app.post('/api/run/:moduleId', async (req, res) => {
    try {
      const { moduleId } = req.params;
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }
      
      const runResult = await TestRunner.runCode(moduleId, code);
      res.json(runResult);
    } catch (error) {
      res.status(500).json({ error: 'Code execution failed' });
    }
  });

  return app;
};

describe('API Endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /api/modules', () => {
    it('should return all modules successfully', async () => {
      const mockModules = [
        {
          id: 'module-1',
          title: 'Test Module 1',
          description: 'Test description',
          difficulty: 'Beginner' as const,
          estimatedTime: '30 minutes',
          tags: ['express', 'node'],
          files: {
            lab: { readme: 'lab/README.md' },
            exercise: { readme: 'exercise/README.md', server: 'exercise/server.js', test: 'exercise/test.js', solution: 'exercise/solution.js', package: 'exercise/package.json' }
          },
          learningObjectives: ['Learn Express basics'],
          prerequisites: ['JavaScript knowledge']
        }
      ];

      mockGetAllModules.mockReturnValue(mockModules);

      const response = await request(app)
        .get('/api/modules')
        .expect(200);

      expect(response.body).toEqual(mockModules);
      expect(mockGetAllModules).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when loading modules fails', async () => {
      mockGetAllModules.mockImplementation(() => {
        throw new Error('Failed to load modules');
      });

      const response = await request(app)
        .get('/api/modules')
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to load modules' });
    });
  });

  describe('GET /api/modules/:moduleId', () => {
    it('should return module content for valid module ID', async () => {
      const mockModuleContent = {
        module: {
          id: 'module-1',
          title: 'Test Module',
          description: 'Test description',
          difficulty: 'Beginner' as const,
          estimatedTime: '30 minutes',
          tags: ['express'],
          files: {
            lab: { readme: 'lab/README.md' },
            exercise: { readme: 'exercise/README.md', server: 'exercise/server.js', test: 'exercise/test.js', solution: 'exercise/solution.js', package: 'exercise/package.json' }
          },
          learningObjectives: ['Learn Express'],
          prerequisites: ['JavaScript']
        },
        labContent: '# Lab Content',
        exerciseContent: {
          readme: '# Exercise README',
          editorFiles: {
            server: 'const express = require("express");',
            test: 'describe("Server", () => {});',
            package: '{"name": "test"}'
          },
          solution: '// Solution code'
        }
      };

      mockGetModuleContent.mockReturnValue(mockModuleContent);

      const response = await request(app)
        .get('/api/modules/module-1')
        .expect(200);

      expect(response.body).toEqual(mockModuleContent);
      expect(mockGetModuleContent).toHaveBeenCalledWith('module-1');
    });

    it('should return 404 for non-existent module', async () => {
      mockGetModuleContent.mockReturnValue(null);

      const response = await request(app)
        .get('/api/modules/non-existent')
        .expect(404);

      expect(response.body).toEqual({ error: 'Module not found' });
    });

    it('should handle errors when loading module content fails', async () => {
      mockGetModuleContent.mockImplementation(() => {
        throw new Error('File system error');
      });

      const response = await request(app)
        .get('/api/modules/module-1')
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to load module content' });
    });
  });

  describe('POST /api/test/:moduleId', () => {
    it('should run tests successfully with valid code', async () => {
      const mockTestResult = {
        moduleId: 'module-1',
        totalTests: 2,
        passedTests: 1,
        failedTests: 1,
        results: [
          { testName: 'Test 1', passed: true },
          { testName: 'Test 2', passed: false, error: 'Assertion failed' }
        ],
        executionTime: 1000
      };

      mockTestRunner.runTests.mockResolvedValue(mockTestResult);

      const response = await request(app)
        .post('/api/test/module-1')
        .send({ code: 'const express = require("express");' })
        .expect(200);

      expect(response.body).toEqual(mockTestResult);
      expect(mockTestRunner.runTests).toHaveBeenCalledWith('module-1', 'const express = require("express");');
    });

    it('should return 400 when code is missing', async () => {
      const response = await request(app)
        .post('/api/test/module-1')
        .send({})
        .expect(400);

      expect(response.body).toEqual({ error: 'Code is required' });
    });

    it('should handle test execution errors', async () => {
      mockTestRunner.runTests.mockRejectedValue(new Error('Test execution failed'));

      const response = await request(app)
        .post('/api/test/module-1')
        .send({ code: 'invalid code' })
        .expect(500);

      expect(response.body).toEqual({ error: 'Test execution failed' });
    });
  });

  describe('POST /api/run/:moduleId', () => {
    it('should run code successfully with valid input', async () => {
      const mockRunResult = {
        moduleId: 'module-1',
        success: true,
        message: 'Server started successfully',
        executionTime: 500,
        serverOutput: 'Server running on port 3000'
      };

      mockTestRunner.runCode.mockResolvedValue(mockRunResult);

      const response = await request(app)
        .post('/api/run/module-1')
        .send({ code: 'const express = require("express");' })
        .expect(200);

      expect(response.body).toEqual(mockRunResult);
      expect(mockTestRunner.runCode).toHaveBeenCalledWith('module-1', 'const express = require("express");');
    });

    it('should return 400 when code is missing', async () => {
      const response = await request(app)
        .post('/api/run/module-1')
        .send({})
        .expect(400);

      expect(response.body).toEqual({ error: 'Code is required' });
    });

    it('should handle code execution errors', async () => {
      mockTestRunner.runCode.mockRejectedValue(new Error('Code execution failed'));

      const response = await request(app)
        .post('/api/run/module-1')
        .send({ code: 'invalid code' })
        .expect(500);

      expect(response.body).toEqual({ error: 'Code execution failed' });
    });
  });
});
