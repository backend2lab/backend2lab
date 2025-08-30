# Module 3 Exercise: Basic Express Routes

## Objective
Create a simple Express.js server with multiple routes that respond with different messages.

## What You'll Build
An Express server with:
- A home route that says "Welcome to Express!"
- An about route that shows your name
- A JSON API route that returns user data

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir express-routes
   cd express-routes
   ```

2. **Initialize and install Express**:
   ```bash
   npm init -y
   npm install express
   ```

3. **Create this file**:
   ```
   express-routes/
   ├── package.json
   └── app.js
   ```

## Your Task

Create `app.js` and complete the Express server:

```javascript
const express = require('express');
const app = express();

// TODO: Create a GET route for '/' that sends "Welcome to Express!"
// Your code here


// TODO: Create a GET route for '/about' that sends "My name is [Your Name]"
// Replace [Your Name] with your actual name
// Your code here


// TODO: Create a GET route for '/api/user' that sends JSON data
// Return this object: { id: 1, name: "John Doe", email: "john@example.com" }
// Your code here


// TODO: Start the server on port 3000
// Add a console.log message when server starts
// Your code here
```

## Step-by-Step Guide

1. **Import Express** (already done)

2. **Create the home route**:
   - Use `app.get('/', callback)`
   - In the callback, use `res.send('Welcome to Express!')`

3. **Create the about route**:
   - Use `app.get('/about', callback)`
   - Send a message with your name

4. **Create the API route**:
   - Use `app.get('/api/user', callback)`
   - Use `res.json()` to send the user object

5. **Start the server**:
   - Use `app.listen(3000, callback)`
   - Add console.log in the callback

## Testing Your Server

1. **Run your server**:
   ```bash
   node app.js
   ```

2. **Test in your browser**:
   - Visit: `http://localhost:3000`
   - Visit: `http://localhost:3000/about`
   - Visit: `http://localhost:3000/api/user`

3. **Stop the server**: Press `Ctrl + C`

## Expected Output

**In your terminal**:
```
Server running on http://localhost:3000
```

**In your browser**:

- `http://localhost:3000` → "Welcome to Express!"
- `http://localhost:3000/about` → "My name is [Your Name]"
- `http://localhost:3000/api/user` → `{"id":1,"name":"John Doe","email":"john@example.com"}`

## Solution

<details>
<summary>Click to see the solution (try it yourself first!)</summary>

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Express!');
});

app.get('/about', (req, res) => {
    res.send('My name is John Smith');
});

app.get('/api/user', (req, res) => {
    res.json({ 
        id: 1, 
        name: "John Doe", 
        email: "john@example.com" 
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

</details>

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add more routes**: Create `/contact` and `/services` pages
2. **Use route parameters**: Create `/user/:id` that shows different user IDs
3. **Handle 404**: Add a catch-all route for non-existent pages
4. **Add middleware**: Log each request to the console

## Example Extensions

```javascript
// Extension 1: More routes
app.get('/contact', (req, res) => {
    res.send('<h1>Contact Us</h1><p>Email: contact@example.com</p>');
});

// Extension 2: Route parameters
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// Extension 3: 404 handler
app.use('*', (req, res) => {
    res.status(404).send('<h1>Page Not Found</h1>');
});

// Extension 4: Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
```

## What You Learned

- ✅ Installing and importing Express
- ✅ Creating an Express application
- ✅ Setting up GET routes
- ✅ Using `res.send()` for HTML/text responses
- ✅ Using `res.json()` for JSON responses
- ✅ Starting an Express server
- ✅ Testing routes in the browser

## Troubleshooting

**Module not found error?**
- Make sure you ran `npm install express`
- Check that `package.json` exists
- Verify you're in the correct directory

**Port already in use?**
- Stop any running servers with `Ctrl + C`
- Try a different port number

**JSON not displaying properly?**
- Install a JSON viewer browser extension
- Or use a tool like Postman to test APIs
