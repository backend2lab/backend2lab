// Hello World Server - Solution
// This is the complete working implementation

const http = require('http');

const server = http.createServer((req, res) => {
  // Check if it's a GET request to the root path
  if (req.method === 'GET' && req.url === '/') {
    // Set response headers
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    // Send JSON response
    res.end(JSON.stringify({ message: 'Hello, World!' }));
  } else {
    // Handle all other routes with 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(3000, () => {
  console.log('Hello World Server running at http://localhost:3000');
});
