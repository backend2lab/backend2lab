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

app.get('/profile', (req, res) => {
    res.json({ message: 'Your profile data', user: 'John Doe' });
});

app.get('/settings', (req, res) => {
    res.json({ message: 'Your settings', theme: 'dark' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
