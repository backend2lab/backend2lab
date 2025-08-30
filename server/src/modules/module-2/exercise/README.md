# Module 2 Exercise: Hello World Server

Your task is to create a simple Node.js HTTP server that returns 'Hello, World!' when accessed. This exercise will test your understanding of basic HTTP server creation.

## 1. Task Requirements

Create an HTTP server that:

1. **Listens on port 3000**
2. **Handles GET requests to the root path `/`**
3. **Returns JSON response**: `{ "message": "Hello, World!" }`
4. **Sets proper Content-Type header**: `application/json`
5. **Returns 404 for all other routes**

## 2. Test Cases

Your server should pass these test cases:

### Test Case 1: Basic GET Request
- **Request**: `GET http://localhost:3000/`
- **Expected Response**: 
  ```json
  {
    "message": "Hello, World!"
  }
  ```
- **Status Code**: 200 OK
- **Headers**: `Content-Type: application/json`

### Test Case 2: Invalid Route
- **Request**: `GET http://localhost:3000/hello`
- **Expected Response**: 
  ```json
  {
    "error": "Not Found"
  }
  ```
- **Status Code**: 404 Not Found

### Test Case 3: Wrong HTTP Method
- **Request**: `POST http://localhost:3000/`
- **Expected Response**: 
  ```json
  {
    "error": "Not Found"
  }
  ```
- **Status Code**: 404 Not Found

## 3. Hints

1. **Use Node.js built-in `http` module**
2. **Check `req.method` and `req.url`**
3. **Set headers with `res.writeHead()`**
4. **Send JSON with `JSON.stringify()`**
5. **Don't forget to call `res.end()`**

## 4. Getting Started

1. Open the `server.js` file in the editor
2. Implement your server logic
3. Use the test cases to verify your solution
4. Run your server and test with the provided test cases

## 5. Code Structure

Your `server.js` should follow this basic structure:

```javascript
const http = require('http');

// TODO: Implement your server here
// 1. Create HTTP server
// 2. Handle GET requests to "/"
// 3. Return JSON response
// 4. Handle 404 for other routes
// 5. Listen on port 3000

console.log('Server starting...');
```

Good luck! 🎉

