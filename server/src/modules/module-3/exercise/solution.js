// Express Routes Exercise - Solution
// This is the complete working implementation

const express = require('express');
const app = express();

// GET route for home page
app.get('/', (req, res) => {
    res.send('Welcome to Express!');
});

// GET route for about page
app.get('/about', (req, res) => {
    res.send('My name is John Smith');
});

// GET route for API user data
app.get('/api/user', (req, res) => {
    res.json({ 
        id: 1, 
        name: "John Doe", 
        email: "john@example.com" 
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
