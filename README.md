# Backend2lab


<img width="4074" height="2102" alt="backend2lab" src="https://github.com/user-attachments/assets/9b351f25-0f08-4982-a51f-15ffcebf87cd" />



Backend2lab is an **interactive learning platform** for backend development.
It combines **labs**, **exercises**, and a **code playground** for beginners to practice backend concepts in a real Node.js environment, directly from the browser.

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Go (v1.25.0 or higher)
- Docker (optional)

### Docker (Recommended)
```bash
# Start both services with Docker
docker compose up
```

### Start Services Separately

#### Start the Backend Server only
```bash
cd server
go mod download
go run main.go
```
The server will be available at `http://localhost:4000`

#### Start the Frontend Client only
```bash
cd client
pnpm install
pnpm run dev
```
The client will be available at `http://localhost:4200`


## Docker

### Basic Commands
```bash
# Start services
docker compose up

# Stop services
docker compose down

# View logs
docker compose logs -f
```

For detailed Docker setup, see [DOCKER.md](./DOCKER.md).

## Project Structure

- **`client/`** - React frontend application
- **`server/`** - Express.js backend API server

Each application can be deployed independently to different platforms.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both client and server
5. Submit a pull request against the dev branch

## License

This project is licensed under the MIT License.
