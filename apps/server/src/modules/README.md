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
│       ├── server.js               # Template file for Monaco editor
│       ├── test.js                 # Mocha test cases
│       ├── solution.js      # Complete working solution
│       └── package.json            # Exercise dependencies
├── module-2/
│   └── ...
└── index.ts                        # Module management utilities
```

## Module Configuration

Each module has a `module.json` file that defines:

```json
{
  "id": "module-1",
  "title": "API Basics & Node.js Server Setup",
  "description": "Learn the fundamentals of APIs, HTTP, and how to build your first Node.js server",
  "difficulty": "Beginner",
  "estimatedTime": "30 minutes",
  "tags": ["nodejs", "http", "api", "server", "basics"],
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
    "Understand HTTP server basics",
    "Learn request/response handling"
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
- **server.js**: Template file shown in Monaco editor
- **test.js**: Mocha test cases for validation
- **solution.js**: Complete working implementation
- **package.json**: Dependencies and scripts for the exercise

## Adding New Modules

1. **Create module directory**: `module-X/`
2. **Create subdirectories**: `lab/` and `exercise/`
3. **Add module.json**: Configure module metadata
4. **Create lab content**: `lab/README.md`
5. **Create exercise files**: All files in `exercise/` directory
6. **Update index.ts**: Module will be auto-discovered

## Content Guidelines

### Lab Content (README.md)
- Use clear headings and structure
- Include code examples
- Explain concepts step-by-step
- Use emojis for visual appeal
- Link to external resources when helpful

### Exercise Content
- **README.md**: Clear requirements and test cases
- **server.js**: Minimal template with TODOs
- **test.js**: Comprehensive test coverage
- **solution.js**: Clean, well-commented code
- **package.json**: Only necessary dependencies

## Technical Notes

- All files are read synchronously for simplicity
- Module discovery is automatic based on directory naming
- Error handling for missing or malformed modules
- TypeScript interfaces for type safety
- Support for different difficulty levels and tags

