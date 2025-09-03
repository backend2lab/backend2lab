# Module 8 Exercise: Simple JWT Authentication

## Objective
Create a simple authentication system that generates and verifies JWT tokens for user login.

## What You'll Build
A basic authentication system that:
- Creates JWT tokens for valid users
- Verifies tokens to protect routes
- Uses a simple in-memory user store

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir simple-auth
   cd simple-auth
   npm init -y
   ```

2. **Install required packages**:
   ```bash
   npm install jsonwebtoken
   ```

3. **Create this file**:
   ```
   simple-auth/
   └── auth.js
   ```

## Your Task

Create `auth.js` and complete the authentication functions:

```javascript
const jwt = require('jsonwebtoken');

// Simple user database (in real apps, use a real database)
const users = [
    { id: 1, username: 'john', password: 'password123' },
    { id: 2, username: 'jane', password: 'secret456' }
];

const JWT_SECRET = 'my-secret-key'; // In real apps, use environment variables

// TODO: Complete this function to create a JWT token
function createToken(user) {
    // The token should include:
    // - userId: user.id
    // - username: user.username
    // - Expiration time: 1 hour
    
    // Your code here
}

// TODO: Complete this function to verify a JWT token
function verifyToken(token) {
    // Should return the decoded token data or null if invalid
    
    // Your code here
}

// TODO: Complete this function to login a user
function login(username, password) {
    // Steps:
    // 1. Find user by username
    // 2. Check if password matches
    // 3. If valid, create and return token
    // 4. If invalid, return null
    
    // Your code here
}

// Test your functions
console.log('=== Testing Authentication System ===');

// Test 1: Valid login
const token = login('john', 'password123');
console.log('Login token:', token);

// Test 2: Verify the token
if (token) {
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
}

// Test 3: Invalid login
const invalidToken = login('john', 'wrongpassword');
console.log('Invalid login token:', invalidToken);

// Test 4: Invalid token verification
const fakeDecoded = verifyToken('fake-token');
console.log('Fake token decoded:', fakeDecoded);
```

## Step-by-Step Guide

### Step 1: Complete `createToken(user)`
```javascript
function createToken(user) {
    const payload = {
        userId: user.id,
        username: user.username
    };
    
    // Use jwt.sign() with payload, secret, and options
    // Set expiresIn to '1h'
}
```

### Step 2: Complete `verifyToken(token)`
```javascript
function verifyToken(token) {
    try {
        // Use jwt.verify() with token and secret
        // Return the decoded data
    } catch (error) {
        // Return null if verification fails
    }
}
```

### Step 3: Complete `login(username, password)`
```javascript
function login(username, password) {
    // Use users.find() to search for user
    // Check if user exists and password matches
    // If valid, call createToken() and return the token
    // If invalid, return null
}
```

## Testing Your Solution

Run your program with:
```bash
node auth.js
```

## Expected Output

```
=== Testing Authentication System ===
Login token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiam9obiIsImlhdCI6MTYzOTU4NjQwMCwiZXhwIjoxNjM5NTkwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Decoded token: { userId: 1, username: 'john', iat: 1639586400, exp: 1639590000 }
Invalid login token: null
Fake token decoded: null
```

## Solution

<details>
<summary>Click to see the solution (try it yourself first!)</summary>

```javascript
const jwt = require('jsonwebtoken');

const users = [
    { id: 1, username: 'john', password: 'password123' },
    { id: 2, username: 'jane', password: 'secret456' }
];

const JWT_SECRET = 'my-secret-key';

function createToken(user) {
    const payload = {
        userId: user.id,
        username: user.username
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return token;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

function login(username, password) {
    const user = users.find(u => u.username === username);
    
    if (!user || user.password !== password) {
        return null;
    }
    
    return createToken(user);
}

// Test code remains the same...
```

</details>

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add password hashing**: Use bcrypt to hash passwords
2. **Create middleware**: Write an Express middleware function to protect routes
3. **Add token expiration check**: Show when tokens expire
4. **User registration**: Add a function to register new users

## Example Extensions

```javascript
// Extension 1: Check token expiration
function isTokenExpired(decoded) {
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
}

// Extension 2: Simple middleware simulation
function authenticateUser(token) {
    const decoded = verifyToken(token);
    if (!decoded) {
        return { error: 'Invalid token' };
    }
    
    if (isTokenExpired(decoded)) {
        return { error: 'Token expired' };
    }
    
    return { user: decoded };
}
```

## What You Learned

- ✅ Creating JWT tokens with user data
- ✅ Verifying and decoding JWT tokens
- ✅ Basic user authentication flow
- ✅ Handling authentication errors
- ✅ Working with token expiration
- ✅ Simple user validation

## Troubleshooting

**"jsonwebtoken not found" error?**
- Make sure you ran `npm install jsonwebtoken`
- Check that you're in the correct project directory

**Token always null?**
- Check that your JWT_SECRET matches in both functions
- Verify the token format and spelling

**Can't find user?**
- Check username and password spelling
- Make sure the users array has the correct data

## Security Note

This is a simplified example for learning. In production applications:
- Never store passwords in plain text
- Use environment variables for secrets
- Use HTTPS for all authentication
- Implement proper error handling
- Use a real database for user storage
