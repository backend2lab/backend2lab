# Module 8 Exercise: Authentication & Authorization API Server

## Objective
Build a complete Express.js API server with user registration, login, and protected routes to demonstrate authentication and authorization flow.

## What You'll Build
A full authentication API that includes:
- User registration endpoint
- User login endpoint  
- Protected routes that require authentication
- JWT token-based authentication
- Password hashing with bcrypt

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

## Step-by-Step Implementation

### Step 1: Complete the Authentication Middleware

In the `authenticateToken` function, you need to:

1. Extract the token from the Authorization header (format: "Bearer TOKEN")
2. Check if the token exists
3. Verify the token using `jwt.verify()`
4. Add decoded user info to `req.user`
5. Call `next()` to continue to the route handler
6. Send appropriate error responses for missing/invalid tokens

**Hint**: Use `req.headers['authorization']` to get the header and split it to extract the token.

### Step 2: Complete the Registration Endpoint

In the `/api/register` endpoint, implement:

1. Extract email and password from `req.body`
2. Validate that both email and password are provided
3. Check if user already exists
4. Hash the password using bcrypt
5. Create new user object with id, email, and hashed password
6. Save user to users array and write to file
7. Send success response (don't send the hashed password back)

**Hint**: Use `bcrypt.hash(password, 10)` to hash passwords with 10 salt rounds.

### Step 3: Complete the Login Endpoint

In the `/api/login` endpoint, implement:

1. Extract email and password from `req.body`
2. Find user by email
3. Check if user exists
4. Compare password with hashed password using bcrypt
5. If valid, create JWT token with user info
6. Send token back to client
7. Send appropriate error messages for invalid credentials

**Hint**: Use `bcrypt.compare(password, user.password)` to verify passwords.

### Step 4: Complete the Protected Routes

For both `/api/profile` and `/api/dashboard` routes:

1. Add the `authenticateToken` middleware
2. Return user-specific data
3. Get user info from `req.user` (set by middleware)

**Hint**: The middleware should be added as the second parameter: `app.get('/api/profile', authenticateToken, (req, res) => { ... })`

## API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/register` | Register a new user | No |
| POST | `/api/login` | Login user | No |
| GET | `/api/public` | Public endpoint | No |
| GET | `/api/profile` | User profile | Yes |
| GET | `/api/dashboard` | User dashboard | Yes |

## Testing Your API

### 1. Start the server:
```bash
npm start
```

### 2. Test with curl commands:

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Access protected route (replace TOKEN with actual token):**
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Test public route:**
```bash
curl -X GET http://localhost:3000/api/public
```

## Expected API Responses

**Successful Registration:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1703123456789,
    "email": "john@example.com"
  }
}
```

**Successful Login:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1703123456789,
    "email": "john@example.com"
  }
}
```

**Protected Profile Route:**
```json
{
  "message": "User profile data",
  "user": {
    "userId": 1703123456789,
    "email": "john@example.com"
  },
  "profileData": {
    "memberSince": "2024-01-15",
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

## Running Tests

```bash
npm test
```

The tests will verify:
- User registration with password hashing
- User login and JWT token generation
- Protected route access with valid tokens
- Error handling for invalid/missing tokens
- Data persistence across requests

## Solution Hints

<details>
<summary>Hint for Authentication Middleware</summary>

```javascript
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}
```
</details>

<details>
<summary>Hint for Registration Endpoint</summary>

```javascript
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    const users = readUsers();
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // Continue with user creation...
});
```
</details>

<details>
<summary>Hint for Login Endpoint</summary>

```javascript
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    const users = readUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token and send response...
});
```
</details>

## What You'll Learn

- ✅ Building complete authentication flow
- ✅ User registration with password hashing
- ✅ JWT token creation and verification
- ✅ Protecting routes with middleware
- ✅ Handling authentication errors
- ✅ API security best practices
- ✅ File-based data persistence
- ✅ Testing APIs with automated tests

## Authentication Flow Summary

1. **Registration**: User signs up → Password gets hashed → User saved to database
2. **Login**: User credentials verified → JWT token generated → Token sent to client  
3. **Protected Access**: Client sends token in header → Middleware verifies token → Route handler executes
4. **Authorization**: Different routes can have different access levels based on user data

This exercise demonstrates the complete authentication and authorization cycle that real applications use!

## Troubleshooting

- **Port already in use**: Change the PORT constant in server.js
- **Module not found**: Run `npm install` to install dependencies
- **Tests failing**: Make sure the server is running on port 3000
- **JWT errors**: Check that the JWT_SECRET is consistent between server and tests
