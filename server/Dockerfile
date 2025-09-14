# Multi-stage build for Go server with hot reload support
FROM golang:1.25-alpine AS builder

# Install necessary packages
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Development stage with hot reload
FROM golang:1.25-alpine AS development

# Install air for hot reload and other tools
RUN go install github.com/air-verse/air@latest

# Install Node.js, npm, curl for health checks, and Docker CLI
RUN apk add --no-cache nodejs npm curl docker-cli

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy package.json for Node.js dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start with air for hot reload
CMD ["air", "-c", ".air.toml"]

# Production stage
FROM alpine:latest AS production

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port
EXPOSE 4000

# Run the binary
CMD ["./main"]
