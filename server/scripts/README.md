# Scripts

This directory contains utility scripts for the backend playground project.

## Module Creation Script

### `create-module.js`

Automatically creates a new module with the complete folder structure and placeholder files based on the latest module pattern.

#### Usage

```bash
# From the server directory
npm run create-module

# Or directly
node server/scripts/create-module.js
```

#### What it creates

The script automatically:

1. **Determines the next module number** by scanning existing modules
2. **Creates the directory structure**:
   ```
   module-X/
   ├── module.json
   ├── exercise/
   │   ├── package.json
   │   ├── server.js
   │   ├── solution.js
   │   ├── test.js
   │   └── README.md
   └── lab/
       └── README.md
   ```

3. **Generates placeholder content** for all files with clear markers like:
   - `PLACEHOLDER_TITLE`
   - `PLACEHOLDER_DESCRIPTION`
   - `PLACEHOLDER_EXERCISE_NAME`
   - `PLACEHOLDER_TASK_DESCRIPTION`
   - etc.

