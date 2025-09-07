# Backend2Lab Modules

This directory contains all the learning modules for the Backend2Lab platform. Each module is structured to provide both theoretical knowledge (Lab) and practical exercises (Exercise).

## Module Structure

```
modules/
├── module-1/
│   ├── module.json                 # Module configuration and metadata
│   ├── lab/
│   │   └── README.md               # Lab content (rendered in Lab UI)
│   └── exercise/
│       ├── README.md               # Exercise instructions
│       ├── server.js                 # Template file for Monaco editor
│       ├── test.js                 # Mocha test cases
│       ├── solution.js             # Complete working solution
│       └── package.json            # Exercise dependencies
├── module-2/
│   └── ...
└── index.ts                        # Module management utilities
```

## Current Modules

### Module 1: Environment Setup & Node.js Basics
- **Difficulty**: Beginner
- **Estimated Time**: 45 minutes
- **Focus**: Node.js fundamentals, modules, package management
- **Exercise**: Simple greeting function with module exports

### Module 2: API Basics & Node.js Server Setup
- **Difficulty**: Beginner
- **Estimated Time**: 30 minutes
- **Focus**: HTTP server creation, request/response handling
- **Exercise**: Hello World HTTP server

## Module Configuration

Each module has a `module.json` file that defines:

```json
{
  "id": "module-1",
  "title": "Environment Setup & Node.js Basics",
  "description": "Learn the fundamentals of Node.js, including runtime environment, modules, package management, and file system operations",
  "difficulty": "Beginner",
  "estimatedTime": "45 minutes",
  "tags": ["nodejs", "basics", "modules", "npm", "filesystem"],
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
    "Understand Node.js runtime environment",
    "Learn module system and exports"
  ],
  "prerequisites": [
    "Basic JavaScript knowledge"
  ]
}
```

## File Purposes

### Lab Files
- **README.md**: Markdown content displayed in the Lab tab
- Contains theory, explanations, and learning materials

### Exercise Files
- **README.md**: Exercise instructions and requirements
- **server.js**: Template file shown in Monaco editor (primary entry point)
- **test.js**: Mocha test cases for validation
- **solution.js**: Complete working implementation
- **package.json**: Dependencies and scripts for the exercise

## Adding New Modules

1. **Create module directory**: `module-X/` (where X is the next number)
2. **Create subdirectories**: `lab/` and `exercise/`
3. **Add module.json**: Configure module metadata
4. **Create lab content**: `lab/README.md`
5. **Create exercise files**: All files in `exercise/` directory
6. **Update index.ts**: Module will be auto-discovered

## Module Management

The `index.ts` file provides utilities to:

- `getAllModules()`: Get all available modules
- `getModuleById(id)`: Get specific module by ID
- `getModuleContent(id)`: Get complete module content
- `getAvailableModules()`: Get module list for UI

## Content Guidelines

### Lab Content (README.md)
- Use clear headings and structure
- Include code examples
- Explain concepts step-by-step
- Use emojis for visual appeal
- Link to external resources when helpful

### Exercise Content
- **README.md**: Clear requirements and test cases
- **server.js**: Minimal template with TODOs (primary file)
- **test.js**: Comprehensive test coverage using Mocha + Chai
- **solution.js**: Clean, well-commented code
- **package.json**: Only necessary dependencies

## Technical Notes

- All files are read synchronously for simplicity
- Module discovery is automatic based on directory naming (`module-X`)
- Error handling for missing or malformed modules
- TypeScript interfaces for type safety
- Support for different difficulty levels and tags
- Standardized file naming: `server.js` for primary exercise files
- Testing framework: Mocha + Chai for consistent test structure

## File Naming Convention

- **Primary files**: Use `server.js` as the standard entry point
- **Module directories**: `module-1`, `module-2`, etc.
- **Configuration**: `module.json` for each module
- **Documentation**: `README.md` for lab and exercise content
- **Testing**: `test.js` with Mocha + Chai framework
- **Solutions**: `solution.js` for complete implementations


