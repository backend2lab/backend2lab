# Module 2: HTTP Basics & First Server

## What is HTTP?

HTTP (HyperText Transfer Protocol) is the foundation of web communication. It's how browsers talk to servers, and how servers respond back with data.

## HTTP Request-Response Cycle

1. **Client** (browser/app) sends a **request** to server
2. **Server** processes the request
3. **Server** sends back a **response**
4. **Client** receives and uses the response

```
Client  ----[Request]---->  Server
Client  <---[Response]---   Server
```

## HTTP Methods

The most common HTTP methods:

- **GET**: Retrieve data from server
- **POST**: Send data to server
- **PUT**: Update existing data
- **DELETE**: Remove data

```javascript
// Examples:
GET /users        // Get all users
GET /users/123    // Get user with ID 123
POST /users       // Create a new user
PUT /users/123    // Update user 123
DELETE /users/123 // Delete user 123
```

## HTTP Status Codes

Servers respond with status codes to indicate what happened:

- **200**: OK - Everything worked
- **201**: Created - New resource created
- **400**: Bad Request - Client sent invalid data
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Server had a problem

## Node.js HTTP Module

Node.js has a built-in `http` module for creating servers:

```javascript
const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
    // Handle requests here
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
});

// Start listening on port 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

## Request and Response Objects

### Request Object (req)
Contains information about the incoming request:

```javascript
const server = http.createServer((req, res) => {
    console.log('Method:', req.method);    // GET, POST, etc.
    console.log('URL:', req.url);          // /users, /products, etc.
    console.log('Headers:', req.headers);  // Browser info, content type, etc.
});
```

### Response Object (res)
Used to send data back to the client:

```javascript
const server = http.createServer((req, res) => {
    // Set status code and headers
    res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    });
    
    // Send response body
    res.write('<h1>Hello World!</h1>');
    res.end(); // Finish the response
});
```

## URL Parsing

Extract information from URLs:

```javascript
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    console.log('Pathname:', parsedUrl.pathname);  // /users
    console.log('Query:', parsedUrl.query);        // { name: 'john', age: '25' }
});
```

## Basic Routing

Handle different URLs differently:

```javascript
const server = http.createServer((req, res) => {
    const { method, url } = req;
    
    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home Page</h1>');
    } else if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Page</h1>');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Page Not Found</h1>');
    }
});
```

## Serving JSON Data

APIs typically send JSON responses:

```javascript
const server = http.createServer((req, res) => {
    if (req.url === '/api/users') {
        const users = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ];
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }
});
```

## Serving Static Files

Serve HTML, CSS, JS files from disk:

```javascript
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
});
```

## Starting Your Server

```javascript
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

Visit `http://localhost:3000` in your browser to see your server!

## Key Takeaways

- HTTP is request-response communication
- Node.js `http` module creates web servers
- Request object contains client data
- Response object sends data back
- Status codes indicate success/failure
- JSON is the standard format for APIs
- Routing handles different URLs differently

