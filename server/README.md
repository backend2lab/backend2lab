# Backend Playground Server

An Express.js backend server for the Backend Playground application.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The server will be available at `http://localhost:4000`

### Building for Production

```bash
npm run build
```

### Running Production Build

```bash
npm start
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
npm run lint
```

## API Endpoints

- `GET /api/modules` - Get all available modules
- `GET /api/modules/:moduleId` - Get specific module content
- `POST /api/test/:moduleId` - Run tests for a module
- `POST /api/run/:moduleId` - Execute code for a module

## Project Structure

- `src/` - Source code
  - `modules/` - Module definitions and content
  - `utils/` - Utility functions including test runner
  - `functions/` - API function handlers
- `dist/` - Build output (generated)
