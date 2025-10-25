# Module 5: Request Handling & Validation

## What is Request Handling?

Request handling is how your server processes different types of data that clients send. This includes URL parameters, query strings, and request bodies.

## Types of Request Data

### 1. URL Parameters (Route Parameters)

Data embedded in the URL path:

```javascript
// URL: /users/123
app.get('/users/:id', (req, res) => {
    const userId = req.params.id; // "123"
    res.json({ message: `User ID is ${userId}` });
});

// URL: /users/123/posts/456
app.get('/users/:userId/posts/:postId', (req, res) => {
    const { userId, postId } = req.params;
    res.json({ userId, postId });
});
```

### 2. Query Parameters

Data sent after the `?` in URLs:

```javascript
// URL: /search?name=john&age=25
app.get('/search', (req, res) => {
    const { name, age } = req.query;
    res.json({ 
        message: `Searching for ${name}, age ${age}` 
    });
});
```

### 3. Request Body

Data sent in POST/PUT requests:

```javascript
// Enable JSON parsing
app.use(express.json());

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    res.json({ 
        message: `Creating user ${name} with email ${email}` 
    });
});
```

## Why Validate Input?

User input can be:
- **Missing**: Required fields not provided
- **Invalid**: Wrong data type or format
- **Malicious**: Attempting to break your system

```javascript
// Without validation - DANGEROUS!
app.post('/users', (req, res) => {
    const user = {
        name: req.body.name,        // Could be undefined
        age: req.body.age,          // Could be a string
        email: req.body.email       // Could be invalid format
    };
    // This could crash your app!
});
```

## Basic Validation Techniques

### 1. Check for Required Fields

```javascript
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    
    // Check if required fields exist
    if (!name) {
        return res.status(400).json({ 
            error: 'Name is required' 
        });
    }
    
    if (!email) {
        return res.status(400).json({ 
            error: 'Email is required' 
        });
    }
    
    // Continue with valid data
    res.json({ message: 'User created successfully' });
});
```

### 2. Validate Data Types

```javascript
app.post('/users', (req, res) => {
    const { name, age } = req.body;
    
    // Check data types
    if (typeof name !== 'string') {
        return res.status(400).json({ 
            error: 'Name must be a string' 
        });
    }
    
    if (typeof age !== 'number' || age < 0) {
        return res.status(400).json({ 
            error: 'Age must be a positive number' 
        });
    }
    
    res.json({ message: 'Valid data received' });
});
```

### 3. Validate Formats

```javascript
app.post('/users', (req, res) => {
    const { email } = req.body;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            error: 'Invalid email format' 
        });
    }
    
    res.json({ message: 'Valid email' });
});
```

## Validation Helper Function

Create reusable validation:

```javascript
function validateUser(userData) {
    const errors = [];
    
    if (!userData.name) {
        errors.push('Name is required');
    }
    
    if (!userData.email) {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.push('Invalid email format');
    }
    
    if (userData.age && (typeof userData.age !== 'number' || userData.age < 0)) {
        errors.push('Age must be a positive number');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Use the validator
app.post('/users', (req, res) => {
    const validation = validateUser(req.body);
    
    if (!validation.isValid) {
        return res.status(400).json({ 
            errors: validation.errors 
        });
    }
    
    // Data is valid, continue processing
    res.json({ message: 'User created successfully' });
});
```

## Error Response Format

Consistent error responses help clients handle problems:

```javascript
// Good error response format
{
    "success": false,
    "error": "Validation failed",
    "details": [
        "Name is required",
        "Invalid email format"
    ]
}

// Success response format
{
    "success": true,
    "data": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

## Complete Example

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    
    // Validation
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and email are required'
        });
    }
    
    if (age && (typeof age !== 'number' || age < 0)) {
        return res.status(400).json({
            success: false,
            error: 'Age must be a positive number'
        });
    }
    
    // Simulate creating user
    const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase(),
        age: age || null
    };
    
    res.status(201).json({
        success: true,
        data: newUser
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## Key Takeaways

- Always validate user input before processing
- Use appropriate HTTP status codes for errors
- Extract data from params, query, and body
- Return consistent error messages
- Validate both presence and format of data
- Handle edge cases gracefully
