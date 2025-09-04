const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// JWT Secret (in production, use environment variables)
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// Path to users data file
const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize users.json file if it doesn't exist
function initializeUsersFile() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
        console.log('📁 Created users.json file');
    }
}

// Helper function to read users from file
function readUsers() {
    try {
        initializeUsersFile(); // Ensure file exists
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const users = JSON.parse(data);
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error('Error reading users file:', error.message);
        return [];
    }
}

// Helper function to write users to file
function writeUsers(users) {
    try {
        if (!Array.isArray(users)) {
            console.error('Users data must be an array');
            return false;
        }
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users file:', error.message);
        return false;
    }
}

// Helper function to find user by email
function findUserByEmail(email) {
    const users = readUsers();
    return users.find(user => user.email === email);
}

// Helper function to find user by ID
function findUserById(id) {
    const users = readUsers();
    return users.find(user => user.id === id);
}

// Helper function to add new user
function addUser(user) {
    const users = readUsers();
    users.push(user);
    return writeUsers(users);
}

// Helper function to update user
function updateUser(userId, updates) {
    const users = readUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return false;
    }
    users[userIndex] = { ...users[userIndex], ...updates };
    return writeUsers(users);
}

// Helper function to delete user
function deleteUser(userId) {
    const users = readUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    return writeUsers(filteredUsers);
}

// TODO: Complete the authentication middleware function
function authenticateToken(req, res, next) {
    // Steps:
    // 1. Get token from Authorization header (format: "Bearer TOKEN")
    // 2. Check if token exists
    // 3. Verify the token using jwt.verify()
    // 4. Add decoded user info to req.user
    // 5. Call next() to continue to the route handler
    // 6. Send appropriate error responses for missing/invalid tokens
    
    // Your code here
}

// TODO: Complete the registration endpoint
app.post('/api/register', async (req, res) => {
    // Steps:
    // 1. Get email and password from req.body
    // 2. Validate that both email and password are provided
    // 3. Check if user already exists using findUserByEmail()
    // 4. Hash the password using bcrypt
    // 5. Create new user object with id, email, hashed password, registeredAt, and role
    // 6. Save user using addUser() helper function
    // 7. Send success response (don't send the hashed password back)
    
    // Your code here
});

// TODO: Complete the login endpoint
app.post('/api/login', async (req, res) => {
    // Steps:
    // 1. Get email and password from req.body
    // 2. Find user by email using findUserByEmail()
    // 3. Check if user exists
    // 4. Compare password with hashed password using bcrypt
    // 5. If valid, create JWT token with user info
    // 6. Send token back to client
    // 7. Send appropriate error messages for invalid credentials
    
    // Your code here
});

// TODO: Create a protected route that requires authentication
app.get('/api/profile', (req, res) => {
    // This route should:
    // 1. Use the authenticateToken middleware
    // 2. Get user info from req.user (set by middleware)
    // 3. Find complete user data using findUserById()
    // 4. Return the user's profile information (without password)
    
    // Your code here
});

// TODO: Create another protected route - user dashboard
app.get('/api/dashboard', (req, res) => {
    // This route should:
    // 1. Use the authenticateToken middleware  
    // 2. Find user data using findUserById()
    // 3. Return dashboard data specific to the logged-in user
    // 4. Include user info and some mock dashboard data
    
    // Your code here
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Auth API Server running on http://localhost:${PORT}`);
    console.log('\n📋 Available endpoints:');
    console.log('POST /api/register   - Register a new user');
    console.log('POST /api/login      - Login user');
    console.log('GET  /api/public     - Public endpoint');
    console.log('GET  /api/profile    - Protected user profile');
    console.log('GET  /api/dashboard  - Protected dashboard');
    console.log('\n💡 Complete the TODO sections to make the API work!');
});
