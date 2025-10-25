# Module 7 Exercise: Route Protection Middleware

## Objective
Create a custom middleware function that protects specific routes by checking for an authorization header.

## What You'll Build
A middleware function that:
- Checks for authorization header in requests
- Allows access if header is present
- Blocks access if header is missing
- Only applies to specific protected routes

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir auth-middleware
   cd auth-middleware
   npm init -y
   npm install express
   ```

2. **Create this file**:
   ```
   auth-middleware/
   └── server.js
   ```

## Your Task

Create `server.js` and complete the auth middleware:

```javascript
const express = require('express');
const app = express();

// TODO: Create an authorization middleware function
// The function should:
// - Check if req.headers.authorization exists
// - If exists: call next() to continue
// - If missing: send 401 status with error message

function checkAuth(req, res, next) {
    // Your code here
    
}

// Public routes (no middleware needed)
app.get('/', (req, res) => {
    res.json({ message: 'Welcome! This is a public page.' });
});

app.get('/about', (req, res) => {
    res.json({ message: 'About page - open to everyone' });
});

// TODO: Protected routes (use your middleware)
// Add checkAuth middleware BETWEEN the route and handler

app.get('/profile', /* add middleware here */, (req, res) => {
    res.json({ message: 'Your profile data', user: 'John Doe' });
});

app.get('/settings', /* add middleware here */, (req, res) => {
    res.json({ message: 'Your settings', theme: 'dark' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

## Step-by-Step Guide

1. **Complete the checkAuth function**:
   - Check if `req.headers.authorization` exists
   - If it exists, call `next()` to continue
   - If missing, send `res.status(401).json({ error: 'Authorization required' })`

2. **Add middleware to protected routes**:
   - Place `checkAuth` between the route path and handler function
   - Example: `app.get('/profile', checkAuth, (req, res) => { ... })`

## Testing Your Middleware

1. **Start your server**:
   ```bash
   node server.js
   ```

2. **Test public routes** (should work):
   - Visit `http://localhost:3000/` 
   - Visit `http://localhost:3000/about`

3. **Test protected routes without auth** (should fail):
   - Visit `http://localhost:3000/profile`
   - Visit `http://localhost:3000/settings`

4. **Test protected routes with auth** (should work):
   - Use Postman, curl, or browser dev tools to add Authorization header:
   ```bash
   # Using curl
   curl -H "Authorization: Bearer token123" http://localhost:3000/profile
   
   # Using Postman: Add header "Authorization" with value "Bearer token123"
   ```

## Expected Output

**Public routes (no auth needed)**:
```json
{ "message": "Welcome! This is a public page." }
```

**Protected routes without auth header**:
```json
{ "error": "Authorization required" }
```

**Protected routes with auth header**:
```json
{ "message": "Your profile data", "user": "John Doe" }
```

## Challenge Extensions

Once you complete the basic version, try these:

1. **Validate token format**: Check if authorization starts with "Bearer "
2. **Add user info**: Extract user data from token and add to req.user
3. **Different permissions**: Create admin-only routes with separate middleware
4. **Combine middleware**: Add both logging and auth middleware to the same route

## Example Extensions

```javascript
// Extension 1: Validate Bearer token format
function checkBearerToken(req, res, next) {
    const auth = req.headers.authorization;
    
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Bearer token required' });
    }
    
    next();
}

// Extension 3: Admin-only middleware
function checkAdmin(req, res, next) {
    const token = req.headers.authorization;
    
    // Simple check (in real app, decode JWT)
    if (token === 'Bearer admin-token') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
}

// Extension 4: Combine multiple middleware
app.get('/admin', checkAuth, checkAdmin, (req, res) => {
    res.json({ message: 'Admin dashboard' });
});
```

## What You Learned

- ✅ Creating custom middleware functions
- ✅ Placing middleware between routes and handlers
- ✅ Checking request headers for authorization
- ✅ Sending appropriate error responses
- ✅ Understanding middleware execution flow
- ✅ Protecting specific routes selectively

## Troubleshooting

**Middleware not working?**
- Make sure you're calling `next()` when authorization is present
- Check that middleware is placed between route and handler

**Getting 404 errors?**
- Verify your route paths are correct
- Check that the server is running on the right port

**Authorization header not working?**
- Ensure the header name is exactly "Authorization"
- Check that you're sending the request to the correct URL
