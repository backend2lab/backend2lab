# Docker Setup for Backend Playground

This project includes Docker configuration for both development and production environments with hot reload support.

## Quick Start

### Development with Hot Reload

```bash
# Start both services with hot reload
docker compose up

# Or run in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Services

- **Server**: Go application with Air for hot reload
  - URL: http://localhost:4000
  - Health check: http://localhost:4000/health
  - API: http://localhost:4000/api

- **Client**: React application with Vite for hot reload
  - URL: http://localhost:4200
  - Hot reload enabled for instant updates

## Docker Commands

### Build and Run Individual Services

```bash
# Build server (development stage with hot reload)
docker build --target development -t backend-playground-server ./server

# Build client (development stage with hot reload)
docker build --target development -t backend-playground-client ./client

# Run server in development mode (with hot reload via Air)
docker run -p 4000:4000 -v $(pwd)/server:/app backend-playground-server

# Run client in development mode (with hot reload via Vite)
docker run -p 4200:4200 -v $(pwd)/client:/app backend-playground-client
```

### Production Builds

```bash
# Build production images
docker build --target production -t backend-playground-server:prod ./server
docker build --target production -t backend-playground-client:prod ./client

# Run production containers
docker run -p 4000:4000 backend-playground-server:prod
docker run -p 80:80 backend-playground-client:prod
```

## Development Features

### Hot Reload
- **Server**: Uses Air to automatically rebuild and restart the Go application on file changes
- **Client**: Uses Vite's built-in hot module replacement for instant updates

## Troubleshooting

### Port Conflicts
If ports 4000 or 4200 are already in use:
```bash
# Check what's using the ports
lsof -i :4000
lsof -i :4200

# Kill processes or change ports in docker compose.yml
```
