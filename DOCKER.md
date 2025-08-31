# Docker Setup for Backend2Lab

This document explains how to run the Backend2Lab project using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the production version:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t backend2lab .
   ```

2. **Run the container:**
   ```bash
   docker run -p 4000:4000 -p 4200:4200 backend2lab
   ```

3. **Run in detached mode:**
   ```bash
   docker run -d -p 4000:4000 -p 4200:4200 --name backend2lab-container backend2lab
   ```

## Development Mode

To run the project in development mode with hot reloading:

```bash
docker-compose --profile dev up --build
```

This will:
- Mount your local source code into the container
- Enable hot reloading for both client and server
- Run on ports 4001 (server) and 4201 (client)

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

You can customize the following environment variables:

- `NODE_ENV`: Set to `production` or `development`
- `HOST`: Server host (default: `0.0.0.0`)
- `PORT`: Server port (default: `4000`)

Example with custom environment:
```bash
docker run -e NODE_ENV=production -e PORT=3000 -p 3000:3000 -p 4200:4200 backend2lab
```

## Troubleshooting

### Check container logs:
```bash
# Using docker-compose
docker-compose logs

# Using docker
docker logs backend2lab-container
```

### Access container shell:
```bash
# Using docker-compose
docker-compose exec backend2lab sh

# Using docker
docker exec -it backend2lab-container sh
```

### Rebuild without cache:
```bash
docker-compose build --no-cache
```

### Clean up:
```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove all unused containers, networks, and images
docker system prune -a
```

## Production Deployment

For production deployment, consider:

1. **Using a reverse proxy** (nginx, traefik) in front of the application
2. **Setting up SSL/TLS certificates**
3. **Configuring proper logging and monitoring**
4. **Using Docker secrets for sensitive data**

Example nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
