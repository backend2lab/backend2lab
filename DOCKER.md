# Docker Development Setup for Backend2Lab

This document explains how to run the Backend2Lab project in development mode using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the development environment:**
   ```bash
   docker compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker compose up -d --build
   ```

3. **Stop the services:**
   ```bash
   docker compose down
   ```

### Option 2: Using the Development Script

Use the provided development script for easy startup:

```bash
./dev.sh
```

This script will:
- Check if Docker is running
- Build and start the development containers
- Show you the URLs to access your services

## Development Features

The Docker setup provides:

- **Hot Reloading**: Both client and server automatically reload when you make changes
- **Volume Mounting**: Your local code is mounted into the containers
- **Live Updates**: Changes are reflected immediately without rebuilding
- **Development Tools**: Full access to development features and debugging

## Accessing the Application

Once the containers are running:

- **Client (Frontend):** http://localhost:4200
- **Server API:** http://localhost:4000
- **API Endpoints:**
  - `GET /api/modules` - List all available modules
  - `GET /api/modules/:moduleId` - Get specific module content
  - `POST /api/test/:moduleId` - Run tests for a module
  - `POST /api/run/:moduleId` - Execute code for a module

## Environment Variables

The development environment uses these default settings:

- `NODE_ENV`: `development` (enables hot reloading and debugging)
- `HOST`: `0.0.0.0` (allows external connections)
- `PORT`: `4000` (server) and `4200` (client)
- `VITE_API_URL`: `http://localhost:4000` (client connects to server)

You can override these in the `docker-compose.yml` file if needed.

## Project Structure

The Docker development setup includes:

```
├── docker-compose.yml          # Main development orchestration
├── server/
│   ├── Dockerfile.dev         # Server development container
│   └── package.json           # Server dependencies
├── client/
│   ├── Dockerfile.dev         # Client development container
│   └── package.json           # Client dependencies
└── dev.sh                     # Development startup script
```

### Container Details:

- **Server Container**: Node.js 18 + npm, runs `npm run dev` with tsx
- **Client Container**: Node.js 20 + pnpm, runs `pnpm run dev` with Vite
- **Ports**: Server (4000), Client (4200)
- **Volumes**: Local code mounted for hot reloading

## Troubleshooting

### Check container logs:
```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs server
docker compose logs client

# Follow logs in real-time
docker compose logs -f
```

### Access container shell:
```bash
# Access server container
docker compose exec server sh

# Access client container
docker compose exec client sh
```

### Rebuild without cache:
```bash
# Rebuild all services
docker compose build --no-cache

# Rebuild specific service
docker compose build --no-cache server
docker compose build --no-cache client
```

### Clean up:
```bash
# Remove containers and networks
docker compose down

# Remove containers, networks, and volumes
docker compose down -v

# Remove all unused containers, networks, and images
docker system prune -a
```

## Development Workflow

### Daily Development:
1. **Start the environment**: `./dev.sh` or `docker compose up --build`
2. **Make changes** to your code - they'll automatically reload
3. **View logs** if needed: `docker compose logs -f`
4. **Stop when done**: `docker compose down`

### Common Commands:
```bash
# Start development environment
docker compose up --build

# View logs
docker compose logs -f

# Rebuild after dependency changes
docker compose build --no-cache

# Stop services
docker compose down

# Restart a specific service
docker compose restart server
docker compose restart client
```

### Tips:
- The client will automatically reload when you save React/TypeScript files
- The server will restart when you save Node.js/TypeScript files
- Check the logs if something isn't working as expected
- Use `docker compose down` to clean up when you're done developing
