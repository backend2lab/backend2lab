# Module 5 Exercise: User Registration Validator

## Objective
Create a simple Express endpoint that validates user registration data and returns appropriate responses.

## What You'll Build
An API endpoint that:
- Accepts user registration data
- Validates the input
- Returns success or error messages

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir user-validator
   cd user-validator
   npm init -y
   npm install express
   ```

2. **Create this file**:
   ```
   user-validator/
   └── server.js
   ```

## Your Task

Create `server.js` and complete the validation logic:

```javascript
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
```

## Validation Requirements

Your endpoint should validate:

1. **Name**: Must be provided and not empty
2. **Email**: Must be provided and not empty  
3. **Age**: If provided, must be a positive number

## Expected Responses

### Success Response (Status 201):
```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 25
    }
}
```

### Error Response (Status 400):
```json
{
    "success": false,
    "error": "Name is required"
}
```

## Testing Your Solution

Use a tool like Postman or curl to test:

### Test 1: Valid Data
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":25}'
```

### Test 2: Missing Name
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","age":25}'
```

### Test 3: Invalid Age
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":-5}'
```

## Solution

<details>
<summary>Click to see the solution (try it yourself first!)</summary>

```javascript
const express = require('express');
const app = express();

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
    if (age !== undefined && (typeof age !== 'number' || age < 0)) {
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
```

</details>

## Challenge Extensions

Once you complete the basic version, try these:

1. **Email format validation**: Check if email contains @ and valid format
2. **Multiple validation errors**: Return all errors at once, not just the first one
3. **Additional fields**: Add validation for phone number or address
4. **Sanitization**: Clean up input data (trim whitespace, lowercase email)

## What You Learned

- ✅ Processing request body data with Express
- ✅ Implementing input validation
- ✅ Returning appropriate HTTP status codes
- ✅ Creating consistent API response formats
- ✅ Handling missing and invalid data
- ✅ Using conditional logic for validation

## Troubleshooting

**Cannot read property of undefined?**
- Make sure you're sending JSON data
- Check that `express.json()` middleware is added

**Validation not working?**
- Check your if/else logic
- Make sure you're using `return` to stop execution after errors

**Postman/curl not working?**
- Ensure your server is running
- Check the Content-Type header is set to `application/json`
