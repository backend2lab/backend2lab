# Module 8: Authentication & Security

## What is Authentication?

Authentication is the process of verifying who a user is. It answers the question: "Are you who you say you are?"

Common authentication methods:
- **Username/Password**: Most common approach
- **Tokens**: Secure, temporary access keys
- **OAuth**: Login with Google, Facebook, etc.

## Authentication vs Authorization

- **Authentication**: Who are you? (Login)
- **Authorization**: What can you do? (Permissions)

## Password Security

### Never Store Plain Text Passwords

```javascript
// ❌ NEVER DO THIS
const user = {
    email: 'john@example.com',
    password: 'mypassword123'  // Visible to anyone!
};
```

### Always Hash Passwords

```javascript
// ✅ DO THIS
const bcrypt = require('bcrypt');

const user = {
    email: 'john@example.com',
    password: '$2b$10$N9qo8uLOickgx2ZMRZoMye...' // Hashed!
};
```

## Password Hashing with Bcrypt

Bcrypt is a secure hashing library that:
- Creates unique hashes for the same password
- Is slow by design (prevents brute force attacks)
- Includes salt automatically

### Hashing a Password

```javascript
const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
    const saltRounds = 10; // Higher = more secure, slower
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

// Usage
const hashedPwd = await hashPassword('userpassword123');
console.log(hashedPwd); // $2b$10$N9qo8uLOickgx2ZMRZoMye...
```

### Verifying a Password

```javascript
async function verifyPassword(plainPassword, hashedPassword) {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid; // true or false
}

// Usage
const isCorrect = await verifyPassword('userpassword123', hashedPwd);
console.log(isCorrect); // true
```

## JSON Web Tokens (JWT)

JWT is a secure way to transmit information between parties. It's like a digital ID card.

### JWT Structure

A JWT has three parts separated by dots:
```
header.payload.signature
```

Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Creating JWTs

```javascript
const jwt = require('jsonwebtoken');

function createToken(user) {
    const payload = {
        userId: user.id,
        email: user.email
    };
    
    const secret = 'your-secret-key'; // Keep this secret!
    const options = { expiresIn: '1h' }; // Token expires in 1 hour
    
    const token = jwt.sign(payload, secret, options);
    return token;
}
```

### Verifying JWTs

```javascript
function verifyToken(token) {
    try {
        const secret = 'your-secret-key';
        const decoded = jwt.verify(token, secret);
        return decoded; // { userId: 123, email: 'john@example.com' }
    } catch (error) {
        return null; // Invalid token
    }
}
```

## Authentication Middleware

Middleware functions run between the request and response to check if users are authenticated.

```javascript
function authenticateToken(req, res, next) {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid token' });
    }
    
    // Add user info to request object
    req.user = decoded;
    next(); // Continue to the next middleware/route
}
```

## Protected Routes

Use middleware to protect routes that require authentication:

```javascript
const express = require('express');
const app = express();

// Public route - no authentication required
app.get('/api/public', (req, res) => {
    res.json({ message: 'This is public data' });
});

// Protected route - authentication required
app.get('/api/profile', authenticateToken, (req, res) => {
    // req.user is available here (set by middleware)
    res.json({ 
        message: 'This is private data',
        user: req.user 
    });
});
```

## Login Flow

1. User sends username/password
2. Server verifies password against hash
3. If valid, server creates JWT token
4. Server sends token back to client
5. Client includes token in future requests

```javascript
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const user = findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 2. Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 3. Create JWT token
    const token = createToken(user);
    
    // 4. Send token to client
    res.json({ 
        message: 'Login successful',
        token: token 
    });
});
```

## Environment Variables for Secrets

Never hardcode secrets in your code:

```javascript
// ❌ DON'T DO THIS
const secret = 'my-super-secret-key';

// ✅ DO THIS
const secret = process.env.JWT_SECRET;
```

Create a `.env` file:
```
JWT_SECRET=your-very-long-random-secret-key-here
PORT=3000
```

## Security Headers

Add security headers to protect your API:

```javascript
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
```

## Key Security Principles

1. **Never trust user input** - Always validate and sanitize
2. **Use HTTPS in production** - Encrypt data in transit
3. **Keep secrets secret** - Use environment variables
4. **Hash passwords** - Never store plain text
5. **Expire tokens** - Set reasonable expiration times
6. **Validate tokens** - Always verify on protected routes

## Key Takeaways

- Authentication verifies user identity
- Hash passwords with bcrypt, never store plain text
- JWT tokens are secure, temporary access keys
- Middleware functions protect routes
- Environment variables store sensitive data
- Always validate and sanitize user input
