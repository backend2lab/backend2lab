const express = require('express');
const app = express();

// Enable JSON parsing
app.use(express.json());

// TODO: Create a POST endpoint at /register
// The endpoint should:
// - Accept name, email, and age in request body
// - Validate that name and email are provided
// - Validate that age is a positive number (if provided)
// - Return appropriate success/error responses

app.post('/register', (req, res) => {
    // Get data from request body
    const { name, email, age } = req.body;
    
    // TODO: Add your validation logic here
    
    // Check if name is provided
    
    // Check if email is provided
    
    // Check if age is valid (if provided)
    
    // If validation passes, return success response
    
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
