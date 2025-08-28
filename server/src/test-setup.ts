/// <reference types="jest" />

// Set up global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock process.cwd() to return a predictable path
jest.spyOn(process, 'cwd').mockReturnValue('/mock/workspace/path');

// Mock process.platform for cross-platform compatibility
Object.defineProperty(process, 'platform', {
  value: 'darwin',
  writable: false
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
