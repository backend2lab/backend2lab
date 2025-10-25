# Module 3: Express.js Foundation

## What is Express.js?

Express.js is a web framework for Node.js that makes building web servers and APIs much easier. Instead of writing complex code with the basic `http` module, Express provides simple, powerful tools.

## Why Use Express?

- **Simpler syntax**: Less code to write
- **Built-in features**: Routing, middleware, static files
- **Popular**: Most Node.js projects use Express
- **Flexible**: Works for websites and APIs

## Installing Express

Express is an NPM package that needs to be installed:

```bash
# Initialize your project
npm init -y

# Install Express
npm install express
```

## Basic Express Server

Creating a server with Express is much simpler:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

Compare this to the raw Node.js version - much cleaner!

## Express App Object

The `app` object is your main Express application:

```javascript
const app = express();

// app.get()    - Handle GET requests
// app.post()   - Handle POST requests  
// app.put()    - Handle PUT requests
// app.delete() - Handle DELETE requests
// app.use()    - Add middleware
// app.listen() - Start the server
```

## Basic Routing

Express makes routing simple and readable:

```javascript
const app = express();

// GET route
app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>');
});

// Another GET route
app.get('/about', (req, res) => {
    res.send('<h1>About Page</h1>');
});

// POST route
app.post('/users', (req, res) => {
    res.send('Creating a new user');
});

// Handle any other route (404)
app.use('*', (req, res) => {
    res.status(404).send('<h1>Page Not Found</h1>');
});
```

## Route Parameters

Extract values from URLs:

```javascript
// Route with parameter
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
    const { userId, postId } = req.params;
    res.send(`User: ${userId}, Post: ${postId}`);
});
```

## Query Parameters

Handle URL query strings:

```javascript
// URL: /search?name=john&age=25
app.get('/search', (req, res) => {
    const { name, age } = req.query;
    res.send(`Searching for: ${name}, age: ${age}`);
});
```

## Response Methods

Express provides many ways to send responses:

```javascript
app.get('/examples', (req, res) => {
    // Send plain text
    res.send('Hello World');
    
    // Send HTML
    res.send('<h1>Hello World</h1>');
    
    // Send JSON
    res.json({ message: 'Hello World', status: 'success' });
    
    // Send with status code
    res.status(201).send('Created successfully');
    
    // Redirect
    res.redirect('/home');
});
```

## Middleware Concept

Middleware are functions that run between the request and response. They are layers that process requests:

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

### Built-in Middleware

```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));
```

### Custom Middleware

```javascript
// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Must call next() to continue
});

// Authentication middleware (example)
app.use('/admin', (req, res, next) => {
    // Check if user is authenticated
    const isAuthenticated = true; // Your logic here
    
    if (isAuthenticated) {
        next(); // Continue to next middleware/route
    } else {
        res.status(401).send('Unauthorized');
    }
});
```

## Handling Different HTTP Methods

```javascript
const app = express();

// GET - Retrieve data
app.get('/users', (req, res) => {
    res.json([{ id: 1, name: 'John' }]);
});

// POST - Create new data
app.post('/users', (req, res) => {
    // req.body contains the posted data
    const newUser = req.body;
    res.status(201).json({ id: 2, ...newUser });
});

// PUT - Update data
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    res.json({ id: userId, ...updates });
});

// DELETE - Remove data
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User ${userId} deleted` });
});
```

## Error Handling

Express has built-in error handling:

```javascript
// Route that might cause an error
app.get('/error-example', (req, res) => {
    throw new Error('Something went wrong!');
});

// Error handling middleware (always last)
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Something broke!');
});
```

## Project Structure

A typical Express project structure:

```
my-express-app/
├── package.json
├── server.js           # Main server file
├── routes/             # Route handlers
├── middleware/         # Custom middleware
├── public/             # Static files (CSS, images)
└── views/              # Templates (if using)
```

## Complete Example

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Express!</h1>');
});

app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ]);
});

app.post('/api/users', (req, res) => {
    const { name } = req.body;
    res.status(201).json({ id: 3, name });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

## Key Takeaways

- Express simplifies Node.js web development
- Routing is clean and intuitive
- Middleware adds functionality to your app
- Built-in support for JSON, static files, and more
- Much less code than raw Node.js
- Industry standard for Node.js web applications
