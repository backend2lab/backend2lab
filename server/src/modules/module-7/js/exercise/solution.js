const express = require('express');
const app = express();

function checkAuth(req, res, next) {
    if (req.headers.authorization) {
        next();
    } else {
        res.status(401).json({ error: 'Authorization required' });
    }
}

// Export the middleware function for testing
module.exports = { checkAuth };

// Public routes (no middleware needed)
app.get('/', (req, res) => {
    res.json({ message: 'Welcome! This is a public page.' });
});

app.get('/about', (req, res) => {
    res.json({ message: 'About page - open to everyone' });
});

// Protected routes (use your middleware)
app.get('/profile', checkAuth, (req, res) => {
    res.json({ message: 'Your profile data', user: 'John Doe' });
});

app.get('/settings', checkAuth, (req, res) => {
    res.json({ message: 'Your settings', theme: 'dark' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
