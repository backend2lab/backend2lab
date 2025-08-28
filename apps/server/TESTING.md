# Server Testing Guide

This document provides comprehensive information about testing the server application.

## Test Structure

The server tests are organized into three main categories:

### 1. Unit Tests (`*.spec.ts`)
- **Location**: `src/**/*.spec.ts`
- **Purpose**: Test individual functions and classes in isolation
- **Coverage**: Core business logic, utilities, and helper functions

### 2. Integration Tests (`integration.spec.ts`)
- **Location**: `src/integration.spec.ts`
- **Purpose**: Test API endpoints and server functionality as a whole
- **Coverage**: End-to-end API testing with real Express server instances

### 3. Test Setup (`test-setup.ts`)
- **Location**: `src/test-setup.ts`
- **Purpose**: Global test configuration and utilities
- **Coverage**: Jest configuration, global mocks, and test helpers

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npx nx test server --testPathPattern=testRunner.spec.ts

# Run tests matching a pattern
npx nx test server --testNamePattern="should run code successfully"
```

### Nx Commands

```bash
# Run server tests using Nx
nx test server

# Run with specific options
nx test server --watch --coverage --verbose
```

## Test Files Overview

### 1. `main.spec.ts` - API Endpoint Tests
Tests all Express server endpoints with mocked dependencies:

- **GET /api/modules** - Retrieve all available modules
- **GET /api/modules/:moduleId** - Get specific module content
- **POST /api/test/:moduleId** - Execute tests for user code
- **POST /api/run/:moduleId** - Run user code without tests
- **CORS Headers** - Verify proper CORS configuration

**Key Test Scenarios:**
- ✅ Successful API responses
- ❌ Error handling (404, 500, 400)
- 🔒 Input validation
- 🌐 CORS configuration
- 📝 Request/response structure validation

### 2. `testRunner.spec.ts` - TestRunner Unit Tests
Comprehensive unit tests for the TestRunner class:

- **runCode()** - Test code execution functionality
- **runTests()** - Test test execution functionality
- **parseMochaResults()** - Test Mocha output parsing
- **killProcessOnPort()** - Test process management

**Key Test Scenarios:**
- ✅ Successful code execution
- ❌ Module not found errors
- ⏱️ Timeout handling
- 🔌 Port conflicts
- 🧪 Test result parsing
- 🛑 Process cleanup

### 3. `modules/index.spec.ts` - Module Management Tests
Unit tests for module loading and management:

- **getAllModules()** - Test module discovery
- **getModuleById()** - Test module retrieval
- **getModuleContent()** - Test content loading
- **getAvailableModules()** - Test simplified module list

**Key Test Scenarios:**
- ✅ Module loading from filesystem
- ❌ File system errors
- 🔍 Module filtering
- 📁 Directory structure handling
- 📄 File reading operations

### 4. `integration.spec.ts` - End-to-End Tests
Integration tests with real Express server instances:

- **Full API Workflow** - Complete request/response cycles
- **Error Scenarios** - Real error handling
- **Performance** - Large payload handling
- **CORS** - Cross-origin request handling

**Key Test Scenarios:**
- 🔄 Complete API workflows
- 📊 Response structure validation
- 🚨 Real error conditions
- 📦 Large request handling
- 🌐 CORS preflight requests

## Test Utilities

The `test-setup.ts` file provides global test utilities:

```typescript
// Create mock Express request
const req = global.testUtils.createMockRequest(
  { moduleId: 'module-1' },  // params
  { code: 'console.log("test")' },  // body
  { debug: 'true' }  // query
);

// Create mock Express response
const res = global.testUtils.createMockResponse();

// Create mock module data
const module = global.testUtils.createMockModule({
  id: 'custom-module',
  title: 'Custom Module'
});

// Create mock test results
const testResult = global.testUtils.createMockTestResult({
  totalTests: 5,
  passedTests: 4
});

// Wait for async operations
await global.testUtils.wait(100);
```

## Coverage Requirements

The test suite enforces minimum coverage thresholds:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Exclusions

The following files are excluded from coverage:
- `src/**/*.spec.ts` - Test files
- `src/test-setup.ts` - Test configuration
- `src/main.ts` - Server entry point

## Mocking Strategy

### External Dependencies
- **fs** - File system operations
- **child_process** - Process spawning and execution
- **path** - Path manipulation
- **util** - Utility functions

### Internal Dependencies
- **TestRunner** - Code execution and testing
- **Modules** - Module loading and management

### Mock Patterns

```typescript
// Mock external modules
jest.mock('fs');
jest.mock('child_process');

// Mock internal dependencies
jest.mock('./utils/testRunner');
jest.mock('./modules');

// Mock specific functions
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
mockReadFileSync.mockReturnValue('mocked content');
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the scenario
- Arrange tests in logical order (happy path → edge cases → error cases)

### 2. Mocking
- Mock at the module level for external dependencies
- Use `jest.clearAllMocks()` in `beforeEach` for clean state
- Provide realistic mock data that matches expected structures

### 3. Assertions
- Test both success and failure scenarios
- Verify function calls and their parameters
- Check response structures and status codes
- Validate error messages and handling

### 4. Async Testing
- Use `async/await` for asynchronous operations
- Set appropriate timeouts for long-running operations
- Handle promise rejections properly

## Troubleshooting

### Common Issues

1. **Test Timeouts**
   - Increase timeout in `test-setup.ts`
   - Check for hanging async operations
   - Verify mock implementations

2. **Mock Not Working**
   - Ensure mocks are set up before imports
   - Check mock function signatures
   - Verify mock return values

3. **Coverage Issues**
   - Check excluded files in Jest config
   - Verify test coverage of all code paths
   - Add tests for uncovered branches

### Debug Mode

Run tests with verbose output for debugging:

```bash
nx test server --verbose --no-coverage
```

### Watch Mode

Use watch mode during development:

```bash
npm run test:watch
```

This will rerun tests automatically when files change.

## Continuous Integration

The test suite is designed to run in CI environments:

- **Timeout**: 10 seconds per test
- **Coverage**: Enforced thresholds
- **Platform**: Cross-platform compatible
- **Dependencies**: All external dependencies mocked

## Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Cover all code paths** including error cases
3. **Update this documentation** if adding new test types
4. **Maintain coverage thresholds**
5. **Use existing test utilities** when possible
