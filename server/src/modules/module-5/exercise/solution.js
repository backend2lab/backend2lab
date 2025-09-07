const express = require('express');
const app = express();

// Enable JSON parsing
app.use(express.json());

app.post('/register', (req, res) => {
    const { name, email, age } = req.body;
    
    // Check if name is provided
    if (!name || name.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Name is required'
        });
    }
    
    // Check if email is provided
    if (!email || email.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Email is required'
        });
    }
    
    // Check if age is valid (if provided)
    if (age !== undefined && (typeof age !== 'number' || age <= 0)) {
        return res.status(400).json({
            success: false,
            error: 'Age must be a positive number'
        });
    }
    
    // If validation passes, return success response
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            name: name.trim(),
            email: email.trim(),
            age: age || null
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
