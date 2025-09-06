const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// JWT secret (in production, use environment variable)
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// In-memory user storage (in production, use a database)
const users = [];

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

// Password validation function
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return { valid: false, error: 'Password must be at least 8 characters' };
    }
    
    if (!hasUpperCase) {
        return { valid: false, error: 'Password must contain uppercase letter' };
    }
    
    if (!hasLowerCase) {
        return { valid: false, error: 'Password must contain lowercase letter' };
    }
    
    if (!hasNumbers) {
        return { valid: false, error: 'Password must contain number' };
    }
    
    if (!hasSpecialChar) {
        return { valid: false, error: 'Password must contain special character' };
    }
    
    return { valid: true };
}

// Public routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Authentication API!' });
});

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Username, password, and email are required' });
        }
        
        // Check if user already exists
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        
        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.error });
        }
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const user = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: user.id, username: user.username, email: user.email }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = generateToken({ id: user.id, username: user.username });
        
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected routes
app.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
        message: 'Profile data',
        user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt }
    });
});

app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({
        message: 'Welcome to your dashboard!',
        user: req.user,
        stats: {
            totalUsers: users.length,
            lastLogin: new Date().toISOString()
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
