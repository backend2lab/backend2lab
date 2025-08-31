# Module 2 Exercise: Simple Web Server

## Objective
Create a basic HTTP server using Node.js that responds with a simple message when visited in a browser.

## What You'll Build
A web server that:
- Listens on port 3000
- Responds to browser requests
- Returns a simple HTML message

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir simple-server
   cd simple-server
   ```

2. **Create this file**:
   ```
   simple-server/
   └── server.js
   ```

## Your Task

Create `server.js` and complete the server function:

```javascript
const http = require('http');

// TODO: Create a server that responds with "Hello from my first server!"
// The server should:
// - Use http.createServer()
// - Set Content-Type to 'text/html' 
// - Respond with status code 200
// - Send an HTML message

const server = http.createServer((req, res) => {
    // Your code here
    
});

// TODO: Make the server listen on port 3000
// Add a console.log to show when server starts

// Your code here
```

## Step-by-Step Guide

1. **Import the http module** (already done)

2. **Create the server** using `http.createServer()`

3. **In the callback function**:
   - Set the response header with `res.writeHead(200, { 'Content-Type': 'text/html' })`
   - Send your message with `res.end('<h1>Hello from my first server!</h1>')`

4. **Start the server**:
   - Use `server.listen(3000, callback)`
   - Add a console.log in the callback: `'Server running on http://localhost:3000'`

## Testing Your Server

1. **Run your server**:
   ```bash
   node server.js
   ```

2. **Open your browser** and visit: `http://localhost:3000`

3. **Stop the server**: Press `Ctrl + C` in your terminal

## Expected Output

**In your terminal**:
```
Server running on http://localhost:3000
```

**In your browser**:
```
Hello from my first server!
```
(displayed as a large heading)

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add more HTML**: Include CSS styling in your response
2. **Show request info**: Display the URL that was requested
3. **Add a timestamp**: Show when the request was made
4. **Custom port**: Use environment variables for the port number

## Example Extensions

```javascript
// Extension 1: Styled response
res.end(`
    <html>
        <head><title>My Server</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
            <h1 style="color: blue;">Hello from my first server!</h1>
            <p>Welcome to Node.js web development!</p>
        </body>
    </html>
`);

// Extension 2: Show request URL
res.end(`<h1>Hello! You requested: ${req.url}</h1>`);

// Extension 3: Add timestamp
res.end(`<h1>Hello from my server!</h1><p>Time: ${new Date()}</p>`);
```

## What You Learned

- ✅ Creating HTTP servers with Node.js
- ✅ Using the `http` module
- ✅ Handling requests and responses
- ✅ Setting HTTP headers
- ✅ Serving HTML content
- ✅ Starting servers on specific ports

## Troubleshooting

**Port already in use error?**
- Stop any running servers with `Ctrl + C`
- Try a different port number (like 3001)

**Can't access localhost:3000?**
- Make sure your server is still running
- Check you're using the correct port number
- Try refreshing your browser

**Module not found?**
- `http` is built into Node.js, no installation needed
- Check your Node.js installation with `node --version`

