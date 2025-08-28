import request from 'supertest';
import express from 'express';
import { TestRunner } from './utils/testRunner';
import { getAllModules, getModuleContent } from './modules';

// Mock the dependencies for integration tests
jest.mock('./utils/testRunner');
jest.mock('./modules', () => ({
  getAllModules: jest.fn(),
  getModuleContent: jest.fn()
}));

const mockTestRunner = TestRunner as jest.Mocked<typeof TestRunner>;
const mockGetAllModules = getAllModules as jest.MockedFunction<typeof getAllModules>;
const mockGetModuleContent = getModuleContent as jest.MockedFunction<typeof getModuleContent>;

// Create a real Express app for integration testing
const createIntegrationApp = () => {
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

describe('Server Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createIntegrationApp();
    jest.clearAllMocks();
  });

  describe('GET /api/modules', () => {
    it('should return modules with correct structure', async () => {
      const mockModules = [
        {
          id: 'module-1',
          title: 'Express Basics',
          description: 'Learn the fundamentals of Express.js',
          difficulty: 'Beginner' as const,
          estimatedTime: '30 minutes',
          tags: ['express', 'node', 'web'],
          files: {
            lab: { readme: 'lab/README.md' },
            exercise: { 
              readme: 'exercise/README.md', 
              server: 'exercise/server.js', 
              test: 'exercise/test.js', 
              solution: 'exercise/solution.js', 
              package: 'exercise/package.json' 
            }
          },
          learningObjectives: ['Understand Express routing', 'Create basic endpoints'],
          prerequisites: ['JavaScript fundamentals', 'Node.js basics']
        }
      ];

      mockGetAllModules.mockReturnValue(mockModules);

      const response = await request(app)
        .get('/api/modules')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual(mockModules);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('difficulty');
      expect(response.body[0]).toHaveProperty('tags');
      expect(response.body[0]).toHaveProperty('learningObjectives');
      expect(response.body[0]).toHaveProperty('prerequisites');
    });

    it('should handle server errors gracefully', async () => {
      mockGetAllModules.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const response = await request(app)
        .get('/api/modules')
        .expect(500)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ error: 'Failed to load modules' });
    });
  });

  describe('GET /api/modules/:moduleId', () => {
    it('should return complete module content', async () => {
      const mockModuleContent = {
        module: {
          id: 'module-1',
          title: 'Express Basics',
          description: 'Learn Express fundamentals',
          difficulty: 'Beginner' as const,
          estimatedTime: '30 minutes',
          tags: ['express'],
          files: {
            lab: { readme: 'lab/README.md' },
            exercise: { 
              readme: 'exercise/README.md', 
              server: 'exercise/server.js', 
              test: 'exercise/test.js', 
              solution: 'exercise/solution.js', 
              package: 'exercise/package.json' 
            }
          },
          learningObjectives: ['Learn Express'],
          prerequisites: ['JavaScript']
        },
        labContent: '# Lab: Express Fundamentals\n\nThis lab covers the basics of Express.js.',
        exerciseContent: {
          readme: '# Exercise: Create a Simple Server\n\nCreate an Express server that responds to GET requests.',
          editorFiles: {
            server: 'const express = require("express");\nconst app = express();\n\n// Your code here\n\napp.listen(3000, () => {\n  console.log("Server running on port 3000");\n});',
            test: 'const request = require("supertest");\nconst app = require("./server");\n\ndescribe("Express Server", () => {\n  it("should start server", () => {\n    // Test implementation\n  });\n});',
            package: '{\n  "name": "express-exercise",\n  "version": "1.0.0",\n  "dependencies": {\n    "express": "^4.17.1"\n  }\n}'
          },
          solution: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.json({ message: "Hello World!" });\n});\n\napp.listen(3000, () => {\n  console.log("Server running on port 3000");\n});'
        }
      };

      mockGetModuleContent.mockReturnValue(mockModuleContent);

      const response = await request(app)
        .get('/api/modules/module-1')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual(mockModuleContent);
      expect(response.body.module).toHaveProperty('id', 'module-1');
      expect(response.body).toHaveProperty('labContent');
      expect(response.body).toHaveProperty('exerciseContent');
      expect(response.body.exerciseContent).toHaveProperty('editorFiles');
      expect(response.body.exerciseContent.editorFiles).toHaveProperty('server');
      expect(response.body.exerciseContent.editorFiles).toHaveProperty('test');
      expect(response.body.exerciseContent.editorFiles).toHaveProperty('package');
    });

    it('should return 404 for non-existent module', async () => {
      mockGetModuleContent.mockReturnValue(null);

      const response = await request(app)
        .get('/api/modules/non-existent')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ error: 'Module not found' });
    });
  });

  describe('POST /api/test/:moduleId', () => {
    it('should execute tests and return detailed results', async () => {
      const mockTestResult = {
        moduleId: 'module-1',
        totalTests: 3,
        passedTests: 2,
        failedTests: 1,
        results: [
          { 
            testName: 'should start server successfully', 
            passed: true 
          },
          { 
            testName: 'should respond to GET /', 
            passed: true 
          },
          { 
            testName: 'should return correct status code', 
            passed: false, 
            error: 'expected 200 to equal 201',
            expected: 201,
            actual: 200
          }
        ],
        executionTime: 1250
      };

      mockTestRunner.runTests.mockResolvedValue(mockTestResult);

      const response = await request(app)
        .post('/api/test/module-1')
        .send({ 
          code: 'const express = require("express");\nconst app = express();\napp.get("/", (req, res) => res.status(200).json({ message: "Hello" }));\napp.listen(3000);' 
        })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual(mockTestResult);
      expect(response.body).toHaveProperty('totalTests', 3);
      expect(response.body).toHaveProperty('passedTests', 2);
      expect(response.body).toHaveProperty('failedTests', 1);
      expect(response.body.results).toHaveLength(3);
      expect(response.body.results[0]).toHaveProperty('passed', true);
      expect(response.body.results[2]).toHaveProperty('passed', false);
      expect(response.body.results[2]).toHaveProperty('error');
    });

    it('should validate required code parameter', async () => {
      const response = await request(app)
        .post('/api/test/module-1')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ error: 'Code is required' });
    });

    it('should handle test execution failures', async () => {
      mockTestRunner.runTests.mockRejectedValue(new Error('Test runner crashed'));

      const response = await request(app)
        .post('/api/test/module-1')
        .send({ code: 'invalid code' })
        .expect(500)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ error: 'Test execution failed' });
    });
  });

  describe('POST /api/run/:moduleId', () => {
    it('should execute code and return run results', async () => {
      const mockRunResult = {
        moduleId: 'module-1',
        success: true,
        message: 'Server started successfully',
        executionTime: 850,
        serverOutput: 'Server running on port 3000\nReady to accept connections'
      };

      mockTestRunner.runCode.mockResolvedValue(mockRunResult);

      const response = await request(app)
        .post('/api/run/module-1')
        .send({ 
          code: 'const express = require("express");\nconst app = express();\napp.listen(3000, () => console.log("Server running on port 3000"));' 
        })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual(mockRunResult);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body).toHaveProperty('serverOutput');
    });

    it('should handle code execution failures', async () => {
      const mockRunResult = {
        moduleId: 'module-1',
        success: false,
        message: 'Server failed to start',
        executionTime: 500,
        error: 'SyntaxError: Unexpected token',
        serverOutput: 'SyntaxError: Unexpected token\n    at Object.compileFunction'
      };

      mockTestRunner.runCode.mockResolvedValue(mockRunResult);

      const response = await request(app)
        .post('/api/run/module-1')
        .send({ 
          code: 'const express = require("express";\nconst app = express();' // Invalid syntax
        })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual(mockRunResult);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required code parameter', async () => {
      const response = await request(app)
        .post('/api/run/module-1')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ error: 'Code is required' });
    });

    it('should handle execution errors', async () => {
      mockTestRunner.runCode.mockRejectedValue(new Error('Process spawn failed'));

      const response = await request(app)
        .post('/api/run/module-1')
        .send({ code: 'console.log("test");' })
        .expect(500)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ error: 'Code execution failed' });
    });
  });

  describe('CORS and Headers', () => {
    it('should include proper CORS headers', async () => {
      mockGetAllModules.mockReturnValue([]);

      const response = await request(app)
        .get('/api/modules')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin', '*');
      expect(response.headers).toHaveProperty('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
      expect(response.headers).toHaveProperty('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    });

    it('should handle preflight OPTIONS requests', async () => {
      await request(app)
        .options('/api/modules')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle large request bodies', async () => {
      const largeCode = 'console.log("test");\n'.repeat(1000); // Large code block
      
      mockTestRunner.runCode.mockResolvedValue({
        moduleId: 'module-1',
        success: true,
        message: 'Server started successfully',
        executionTime: 100,
        serverOutput: 'Server running'
      });

      const response = await request(app)
        .post('/api/run/module-1')
        .send({ code: largeCode })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });
  });
});
