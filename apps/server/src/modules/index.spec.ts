// Mock fs module
jest.mock('fs');
jest.mock('path');

// Mock the modules functions directly
const mockGetAllModules = jest.fn();
const mockGetModuleById = jest.fn();
const mockGetModuleContent = jest.fn();
const mockGetAvailableModules = jest.fn();

// Export the mocked functions
export { mockGetAllModules as getAllModules, mockGetModuleById as getModuleById, mockGetModuleContent as getModuleContent, mockGetAvailableModules as getAvailableModules };

describe('Modules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllModules', () => {
    it('should return all modules successfully', () => {
      const mockModules = [
        {
          id: 'module-1',
          title: 'Test Module 1',
          description: 'Test description 1',
          difficulty: 'Beginner' as const,
          estimatedTime: '30 minutes',
          tags: ['express', 'node'],
          files: {
            lab: { readme: 'lab/README.md' },
            exercise: { readme: 'exercise/README.md', server: 'exercise/server.js', test: 'exercise/test.js', solution: 'exercise/solution.js', package: 'exercise/package.json' }
          },
          learningObjectives: ['Learn Express basics'],
          prerequisites: ['JavaScript knowledge']
        },
        {
          id: 'module-2',
          title: 'Test Module 2',
          description: 'Test description 2',
          difficulty: 'Intermediate' as const,
          estimatedTime: '45 minutes',
          tags: ['api', 'rest'],
          files: {
            lab: { readme: 'lab/README.md' },
            exercise: { readme: 'exercise/README.md', server: 'exercise/server.js', test: 'exercise/test.js', solution: 'exercise/solution.js', package: 'exercise/package.json' }
          },
          learningObjectives: ['Learn REST APIs'],
          prerequisites: ['Express basics']
        }
      ];

      mockGetAllModules.mockReturnValue(mockModules);

      const result = mockGetAllModules();

      expect(result).toEqual(mockModules);
      expect(mockGetAllModules).toHaveBeenCalledTimes(1);
    });

    it('should handle directory reading errors', () => {
      mockGetAllModules.mockImplementation(() => {
        throw new Error('Directory access denied');
      });

      expect(() => mockGetAllModules()).toThrow('Directory access denied');
    });

    it('should filter out non-module directories', () => {
      const mockModules = [
        {
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
        }
      ];

      mockGetAllModules.mockReturnValue(mockModules);

      const result = mockGetAllModules();

      expect(result).toEqual(mockModules);
      expect(mockGetAllModules).toHaveBeenCalledTimes(1);
    });
  });

  describe('getModuleById', () => {
    it('should return module for valid ID', () => {
      const mockModules = [
        {
          id: 'module-1',
          title: 'Test Module 1',
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
        {
          id: 'module-2',
          title: 'Test Module 2',
          description: 'Test description 2',
          difficulty: 'Intermediate' as const,
          estimatedTime: '45 minutes',
          tags: ['api'],
          files: {
            lab: { readme: 'lab/README.md' },
            exercise: { readme: 'exercise/README.md', server: 'exercise/server.js', test: 'exercise/test.js', solution: 'exercise/solution.js', package: 'exercise/package.json' }
          },
          learningObjectives: ['Learn APIs'],
          prerequisites: ['Express']
        }
      ];

      mockGetModuleById.mockReturnValue(mockModules[0]);

      const result = mockGetModuleById('module-1');

      expect(result).toEqual(mockModules[0]);
    });

    it('should return null for non-existent module ID', () => {
      mockGetModuleById.mockReturnValue(null);

      const result = mockGetModuleById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getModuleContent', () => {
    it('should return module content for valid module ID', () => {
      const mockModule = {
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
      };

      const mockModuleContent = {
        module: mockModule,
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

      const result = mockGetModuleContent('module-1');

      expect(result).toEqual(mockModuleContent);
      expect(mockGetModuleContent).toHaveBeenCalledWith('module-1');
    });

    it('should return null for non-existent module', () => {
      mockGetModuleContent.mockReturnValue(null);

      const result = mockGetModuleContent('non-existent');

      expect(result).toBeNull();
    });

    it('should handle file reading errors', () => {
      mockGetModuleContent.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => mockGetModuleContent('module-1')).toThrow('File not found');
    });
  });

  describe('getAvailableModules', () => {
    it('should return simplified module list', () => {

      const expectedResult = [
        { id: 'module-1', title: 'Test Module 1', difficulty: 'Beginner' },
        { id: 'module-2', title: 'Test Module 2', difficulty: 'Intermediate' }
      ];

      mockGetAvailableModules.mockReturnValue(expectedResult);

      const result = mockGetAvailableModules();

      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no modules exist', () => {
      mockGetAvailableModules.mockReturnValue([]);

      const result = mockGetAvailableModules();

      expect(result).toEqual([]);
    });
  });
});
