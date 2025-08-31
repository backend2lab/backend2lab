# Module 6: Middleware

## What is Middleware?

Middleware are functions that run between receiving a request and sending a response. Think of them as layers that process requests before they reach your route handlers.

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

## How Middleware Works

Every middleware function has access to:
- `req` (request object)
- `res` (response object) 
- `next` (function to call next middleware)

```javascript
function myMiddleware(req, res, next) {
    // Do something with request
    console.log('Processing request...');
    
    // Call next() to continue to next middleware
    next();
}
```

## Types of Middleware

### 1. Application-Level Middleware
Runs for every request to the app:

```javascript
const express = require('express');
const app = express();

// This runs for ALL requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
```

### 2. Router-Level Middleware
Runs only for specific routes:

```javascript
// Only runs for /api routes
app.use('/api', (req, res, next) => {
    console.log('API request received');
    next();
});
```

### 3. Route-Specific Middleware
Runs only for one specific route - placed between the route and handler:

```javascript
// Custom middleware function
const checkAuth = (req, res, next) => {
    if (req.headers.authorization) {
        next(); // User is authenticated
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Middleware sits BETWEEN route and handler
app.get('/protected', checkAuth, (req, res) => {
    res.json({ message: 'Secret data' });
});

// Multiple middleware for one route
app.post('/admin', checkAuth, checkAdmin, (req, res) => {
    res.json({ message: 'Admin only area' });
});
```

### 4. Parameter Middleware
Runs when specific route parameters are present:

```javascript
// Runs whenever :userId parameter is in the route
app.param('userId', (req, res, next, userId) => {
    // Validate user exists
    if (userId < 1) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    req.userId = userId;
    next();
});

app.get('/users/:userId', (req, res) => {
    res.json({ userId: req.userId });
});
```

## Built-in Middleware

Express comes with some built-in middleware:

### express.json()
Parses JSON request bodies:

```javascript
// Without this, req.body is undefined
app.use(express.json());

app.post('/users', (req, res) => {
    console.log(req.body); // Now we can access JSON data
    res.json({ received: req.body });
});
```

### express.urlencoded()
Parses form data:

```javascript
app.use(express.urlencoded({ extended: true }));
```

### express.static()
Serves static files (HTML, CSS, images):

```javascript
// Serve files from 'public' folder
app.use(express.static('public'));

// Now files in 'public' are accessible:
// public/style.css → http://localhost:3000/style.css
```

## Third-Party Middleware

Popular middleware packages you can install:

### cors - Handle Cross-Origin Requests
```bash
npm install cors
```

```javascript
const cors = require('cors');

app.use(cors()); // Allow all origins
// OR
app.use(cors({ origin: 'http://localhost:3000' })); // Specific origin
```

### morgan - HTTP Request Logger
```bash
npm install morgan
```

```javascript
const morgan = require('morgan');

app.use(morgan('combined')); // Logs all requests
```

### helmet - Security Headers
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

app.use(helmet()); // Adds security headers
```

## Custom Middleware Examples

### 1. Request Logger
```javascript
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

app.use(requestLogger);
```

### 2. Authentication Check
```javascript
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    // In real app, verify token here
    req.user = { id: 1, name: 'John' }; // Fake user data
    next();
};
```

### 3. Request Timing
```javascript
const requestTimer = (req, res, next) => {
    req.startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        console.log(`Request took ${duration}ms`);
    });
    
    next();
};
```

## Middleware Order Matters

Middleware runs in the order you define it:

```javascript
// ✅ Correct order
app.use(express.json());        // Parse JSON first
app.use(requestLogger);         // Then log request
app.use('/api', requireAuth);   // Then check auth for /api routes

// ❌ Wrong order
app.use('/api', requireAuth);   // This runs first
app.use(express.json());        // JSON parsing happens after auth check!
```

## Error Handling Middleware

Special middleware with 4 parameters handles errors:

```javascript
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!' 
    });
};

// Error middleware goes LAST
app.use(errorHandler);
```

## Common Patterns

### Multiple Middleware for One Route
```javascript
// Chain multiple middleware functions
app.get('/admin', 
    requestLogger,      // First: log the request
    requireAuth,        // Second: check authentication  
    requireAdmin,       // Third: check admin permissions
    (req, res) => {     // Finally: route handler
        res.json({ users: [] });
    }
);
```

### Route Groups with Middleware
```javascript
// Apply middleware to all routes in a group
const authRouter = express.Router();

// This middleware applies to ALL routes in this router
authRouter.use(requireAuth);

authRouter.get('/profile', (req, res) => {
    res.json({ user: req.user });
});

authRouter.get('/settings', (req, res) => {
    res.json({ settings: {} });
});

// Mount the router with middleware applied
app.use('/api', authRouter);
```

### Conditional Middleware
```javascript
const conditionalAuth = (req, res, next) => {
    if (req.url.startsWith('/public')) {
        next(); // Skip auth for public routes
    } else {
        requireAuth(req, res, next); // Apply auth for other routes
    }
};
```

## Key Takeaways

- Middleware functions run between request and response
- Always call `next()` to continue to next middleware
- Order matters - middleware runs sequentially
- Built-in middleware handles common tasks
- Third-party middleware adds functionality
- Custom middleware solves specific needs
- Error middleware has 4 parameters and goes last
