const http = require('http');

// TODO: Implement your server here
// 1. Create HTTP server
// 2. Handle GET requests to "/"
// 3. Return JSON response
// 4. Handle 404 for other routes
// 5. Listen on port 3000


const server = http.createServer((req, res) => {
    // Implementation here
});

// ===== PROTECTED CODE - DO NOT MODIFY =====
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// ===== END PROTECTED CODE =====
