# Module 9 Exercise: Authentication & Security

## Objective
Create a secure authentication system with JWT tokens, password hashing, and protected routes.

## What You'll Build
A complete authentication system that:
- Registers new users with hashed passwords
- Logs in users and returns JWT tokens
- Protects routes with authentication middleware
- Validates JWT tokens and extracts user information
- Implements proper security measures

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

## Your Task

Complete the authentication functions in `server.js`:

```javascript
// TODO: Create a function to hash passwords
// The function should:
// - Take a plain text password as parameter
// - Use bcrypt.hash() with saltRounds of 10
// - Return the hashed password
// - Handle errors appropriately

async function hashPassword(password) {
    // Your code here
}

// TODO: Create a function to verify passwords
// The function should:
// - Take plain password and hashed password as parameters
// - Use bcrypt.compare() to verify
// - Return true if match, false otherwise
// - Handle errors appropriately

async function verifyPassword(plainPassword, hashedPassword) {
    // Your code here
}

// TODO: Create a function to generate JWT tokens
// The function should:
// - Take user object as parameter
// - Sign with JWT_SECRET
// - Set expiration to 24 hours
// - Return the token

function generateToken(user) {
    // Your code here
}

// TODO: Create authentication middleware
// The middleware should:
// - Extract token from Authorization header
// - Verify the token with jwt.verify()
// - Add user info to req.user
// - Call next() if valid, return 401 if invalid

function authenticateToken(req, res, next) {
    // Your code here
}
```

## API Endpoints

Once you complete the functions, your API will support these endpoints:

### POST /register
- Registers a new user
- Body: `{ "username": "string", "password": "string", "email": "string" }`
- Response: Success message or error

### POST /login
- Logs in a user
- Body: `{ "username": "string", "password": "string" }`
- Response: JWT token and user info

### GET /profile
- Protected route - requires valid JWT token
- Headers: `Authorization: Bearer <token>`
- Response: User profile information

### GET /dashboard
- Protected route - requires valid JWT token
- Headers: `Authorization: Bearer <token>`
- Response: Dashboard data

## Example Usage

### Register a new user:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"SecurePass123!","email":"john@example.com"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"SecurePass123!"}'
```

### Access protected route:
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Security Features to Implement

1. **Password Hashing**: Use bcrypt to hash passwords before storing
2. **JWT Tokens**: Generate secure tokens for authenticated users
3. **Token Validation**: Verify tokens on protected routes
4. **Input Validation**: Validate username, password, and email formats
5. **Error Handling**: Proper error messages without exposing sensitive info

## Password Requirements

Implement these password validation rules:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add refresh tokens**: Implement token refresh mechanism
2. **Add logout functionality**: Blacklist tokens
3. **Add rate limiting**: Prevent brute force attacks
4. **Add email verification**: Send verification emails
5. **Add password reset**: Implement forgot password flow
6. **Add role-based access**: Different permissions for different users

## What You Learned

- ✅ Password hashing with bcrypt
- ✅ JWT token generation and verification
- ✅ Authentication middleware creation
- ✅ Protected route implementation
- ✅ Input validation and sanitization
- ✅ Security best practices
- ✅ Error handling for authentication
- ✅ User registration and login flows

## Troubleshooting

**"bcrypt is not defined" error?**
- Make sure you've installed bcrypt: `npm install bcrypt`
- Import it at the top: `const bcrypt = require('bcrypt');`

**"jwt is not defined" error?**
- Make sure you've installed jsonwebtoken: `npm install jsonwebtoken`
- Import it at the top: `const jwt = require('jsonwebtoken');`

**"Invalid token" error?**
- Check that you're sending the token in the correct format
- Make sure the token hasn't expired
- Verify the JWT_SECRET is the same for signing and verifying

**"User not found" error?**
- Make sure the user exists in the users array
- Check that the username is spelled correctly
- Verify the user was registered successfully

**Password validation failing?**
- Check that the password meets all requirements
- Make sure you're using the correct validation function
- Verify the password is being hashed correctly

Remember: Security is critical - always hash passwords, validate input, and handle errors properly!
