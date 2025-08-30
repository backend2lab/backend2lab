# Module 0: Environment Setup & Node.js Basics

## What is Node.js?

Node.js is a JavaScript runtime that lets you run JavaScript on your computer (server-side), not just in web browsers. It's built on Chrome's V8 engine and is perfect for building backend applications and APIs.

## Why Node.js for Backend?

- **Same Language**: Use JavaScript for both frontend and backend
- **Fast**: Non-blocking, event-driven architecture
- **NPM**: Huge ecosystem of packages
- **JSON**: Native support for JSON data

## Core Concepts

### 1. Runtime Environment

Node.js provides a runtime environment where JavaScript can execute outside the browser. It includes:
- File system access
- Network capabilities  
- Process management

### 2. Modules

Node.js uses a module system to organize code:

```javascript
// Importing a built-in module
const fs = require('fs');

// Importing your own module
const myModule = require('./myModule');

// Exporting from a module
module.exports = {
    greeting: 'Hello World'
};
```

### 3. Package Management with NPM

NPM (Node Package Manager) handles dependencies:

```bash
# Initialize a new project
npm init

# Install a package
npm install express

# Install as dev dependency
npm install --save-dev nodemon
```

### 4. Package.json

The `package.json` file is your project's configuration:

```json
{
  "name": "my-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### 5. File System Operations

Node.js can read and write files:

```javascript
const fs = require('fs');

// Read a file
fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Write a file
fs.writeFile('output.txt', 'Hello World', (err) => {
    if (err) throw err;
    console.log('File saved!');
});
```

## Project Structure

A typical Node.js project structure:

```
my-backend/
├── package.json
├── index.js          # Main entry point
├── routes/           # API routes
├── models/           # Data models
├── utils/            # Helper functions
└── data/             # Data files
```

## Getting Started

1. **Check Node.js installation**:
   ```bash
   node --version
   npm --version
   ```

2. **Create a new project**:
   ```bash
   mkdir my-backend
   cd my-backend
   npm init -y
   ```

3. **Create your first file** (`index.js`):
   ```javascript
   console.log('Hello, Node.js!');
   ```

4. **Run your program**:
   ```bash
   node index.js
   ```

## Key Takeaways

- Node.js runs JavaScript on the server
- Use modules to organize code
- NPM manages packages and dependencies
- package.json configures your project
- File system operations are asynchronous
- Start simple with console.log and basic file operations
