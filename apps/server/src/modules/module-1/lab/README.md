# Module 1: API Basics & Node.js Server Setup

Welcome to your first step in backend API development! 🎉

In this module, you'll learn the fundamentals of APIs, HTTP, and how to build your first server.

## 🌐 What is an API?

An **API (Application Programming Interface)** allows two systems to communicate. In web development, APIs use **HTTP** protocol.

### Example Request/Response Cycle:
- **Client**: `GET /hello`
- **Server**: responds with `{ "message": "Hello, World!" }`

## 🛠️ HTTP Basics

### HTTP Methods:
- **GET** → retrieve data
- **POST** → send new data
- **PUT/PATCH** → update existing data
- **DELETE** → remove data

### Status Codes:
- **200 OK** → Success
- **400 Bad Request** → Invalid input
- **404 Not Found** → Resource not found
- **500 Internal Server Error** → Something broke

## 🚀 Setting up a Node.js Server

### 1. Basic HTTP Server Structure

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Handle requests here
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2. Request Handling

```javascript
const server = http.createServer((req, res) => {
  // Check the request method and URL
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello, World!' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});
```

### 3. Key Concepts

- **req.method**: HTTP method (GET, POST, etc.)
- **req.url**: Requested URL path
- **res.writeHead()**: Set status code and headers
- **res.end()**: Send response and close connection
- **JSON.stringify()**: Convert objects to JSON strings

## 📝 Best Practices

1. **Always set Content-Type header** for JSON responses
2. **Handle all routes** - return 404 for unknown paths
3. **Use proper HTTP status codes**
4. **Validate request methods** - only allow what you need
5. **Error handling** - graceful error responses

## 🔗 Next Steps

In the Exercise section, you'll build your own Hello World server that:
- Responds to GET requests at the root path
- Returns JSON with a "Hello, World!" message
- Handles 404 errors for other routes
- Uses proper HTTP status codes and headers

Ready to start coding? Head to the Exercise tab! 🚀

