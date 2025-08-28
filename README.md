# Backend Playground

Backend Playground is an **interactive learning platform** for backend development.
It combines **labs**, **exercises**, and a **code playground** for beginners to practice backend concepts in a real Node.js environment, directly from the browser.

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### Start the Backend Server
```bash
cd server
npm install
npm run dev
```
The server will be available at `http://localhost:4000`

#### Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
The client will be available at `http://localhost:4200`


## Development

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm run build
npm start
```

### Running Tests

**Backend tests:**
```bash
cd server
npm test
```

## Project Structure

- **`client/`** - React frontend application
- **`server/`** - Express.js backend API server

Each application can be deployed independently to different platforms.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both client and server
5. Submit a pull request

## License

This project is licensed under the MIT License.
