#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let moduleNumber = null;

// Get the next module number
function getNextModuleNumber() {
  const modulesDir = path.join(__dirname, '..', 'src', 'modules');
  const existingModules = fs.readdirSync(modulesDir)
    .filter(dir => dir.startsWith('module-'))
    .map(dir => parseInt(dir.replace('module-', '')))
    .filter(num => !isNaN(num));
  
  return existingModules.length > 0 ? Math.max(...existingModules) + 1 : 1;
}

// Create directory structure
function createDirectoryStructure(moduleNumber) {
  const moduleName = `module-${moduleNumber}`;
  const basePath = path.join(__dirname, '..', 'src', 'modules', moduleName);
  
  // Create main module directory
  fs.mkdirSync(basePath, { recursive: true });
  
  // Create exercise directory
  fs.mkdirSync(path.join(basePath, 'exercise'), { recursive: true });
  
  // Create lab directory
  fs.mkdirSync(path.join(basePath, 'lab'), { recursive: true });
  
  return { moduleName, basePath };
}

// Create module.json
function createModuleJson(moduleNumber, moduleName, basePath) {
  const moduleJson = {
    "id": moduleName,
    "title": "TITLE",
    "description": "DESCRIPTION",
    "difficulty": "Beginner",
    "estimatedTime": "30 minutes",
    "tags": ["nodejs", "placeholder", "tags"],
    "files": {
      "lab": {
        "readme": "lab/README.md"
      },
      "exercise": {
        "readme": "exercise/README.md",
        "server": "exercise/server.js",
        "test": "exercise/test.js",
        "solution": "exercise/solution.js",
        "package": "exercise/package.json"
      }
    },
    "learningObjectives": [
      "OBJECTIVE_1",
      "OBJECTIVE_2",
      "OBJECTIVE_3"
    ],
    "prerequisites": [
      "PREREQUISITE_1",
      "PREREQUISITE_2"
    ]
  };
  
  fs.writeFileSync(
    path.join(basePath, 'module.json'),
    JSON.stringify(moduleJson, null, 2)
  );
}

// Create exercise package.json
function createExercisePackageJson(moduleNumber, basePath) {
  const packageJson = {
    "name": `module-${moduleNumber}-exercise`,
    "version": "1.0.0",
    "description": `Module ${moduleNumber} Exercise: EXERCISE_NAME`,
    "main": "server.js",
    "scripts": {
      "start": "node server.js",
      "test": "mocha test.js",
      "dev": "node server.js"
    },
    "keywords": [
      "nodejs",
      "http",
      "server",
      "api",
      "exercise"
    ],
    "author": "Backend2Lab",
    "license": "MIT",
    "engines": {
      "node": ">=14.0.0"
    },
    "devDependencies": {
      "chai": "^4.3.7",
      "mocha": "^10.2.0"
    }
  };
  
  fs.writeFileSync(
    path.join(basePath, 'exercise', 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

// Create server.js
function createServerJs(basePath) {
  const serverContent = `
    console.log('Server starting...');
  `;
  
  fs.writeFileSync(path.join(basePath, 'exercise', 'server.js'), serverContent);
}

// Create solution.js
function createSolutionJs(basePath) {
  const solutionContent = `
    // This is the complete working implementation for  Module ${moduleNumber}
  `;
  
  fs.writeFileSync(path.join(basePath, 'exercise', 'solution.js'), solutionContent);
}

// Create test.js
function createTestJs(basePath) {
  const testContent = `
    // Test Cases for  Module ${moduleNumber}
    // These are the test cases that your server should pass
  `;
  
  fs.writeFileSync(path.join(basePath, 'exercise', 'test.js'), testContent);
}

// Create exercise README.md
function createExerciseReadme(moduleNumber, basePath) {
  const readmeContent = `# Exercise:  Module ${moduleNumber}`;
  
  fs.writeFileSync(path.join(basePath, 'exercise', 'README.md'), readmeContent);
}

// Create lab README.md
function createLabReadme(moduleNumber, basePath) {
  const readmeContent = `
    # Module ${moduleNumber}: MODULE_TITLE
  `;
  
  fs.writeFileSync(path.join(basePath, 'lab', 'README.md'), readmeContent);
}

// Main function
function createModule() {
  try {
    moduleNumber = getNextModuleNumber();
    const { moduleName, basePath } = createDirectoryStructure(moduleNumber);
    
    console.log(`Creating module: ${moduleName}`);
    
    // Create all files
    createModuleJson(moduleNumber, moduleName, basePath);
    createExercisePackageJson(moduleNumber, basePath);
    createServerJs(basePath);
    createSolutionJs(basePath);
    createTestJs(basePath);
    createExerciseReadme(moduleNumber, basePath);
    createLabReadme(moduleNumber, basePath);
    
    console.log(`Module ${moduleName} created successfully!`);
    console.log(`Remember to update the module content in all files`);
    
  } catch (error) {
    throw error;
    // console.error();
    // process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createModule();
}

module.exports = { createModule };
