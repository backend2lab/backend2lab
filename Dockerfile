# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage for client
FROM base AS client-builder
WORKDIR /app
RUN pnpm run build:client

# Build stage for server
FROM base AS server-builder
WORKDIR /app
RUN pnpm run build:server

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built client from client-builder stage
COPY --from=client-builder /app/client/dist ./client/dist

# Copy built server from server-builder stage
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/src/modules ./server/dist/modules

# Copy server source for runtime (needed for modules)
COPY server/src/modules ./server/dist/modules

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 4000 4200

# Set the default command
CMD ["/app/start.sh"]
