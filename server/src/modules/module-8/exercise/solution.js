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

// Authentication middleware function
function authenticateToken(req, res, next) {
    // 1. Get token from Authorization header (format: "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // 3. Verify the token using jwt.verify()
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        
        // 4. Add decoded user info to req.user
        req.user = decoded;
        
        // 5. Call next() to continue to the route handler
        next();
    });
}

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        // 1. Get email and password from req.body
        const { email, password } = req.body;
        
        // 2. Validate that both email and password are provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        
        // 3. Check if user already exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // 4. Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 5. Create new user object with id, email, and hashed password
        const newUser = {
            id: Date.now().toString(), // Simple ID generation
            email: email,
            password: hashedPassword,
            registeredAt: new Date().toISOString(),
            role: 'user'
        };
        
        // 6. Save user using addUser helper function
        const success = addUser(newUser);
        
        if (!success) {
            return res.status(500).json({ error: 'Failed to save user' });
        }
        
        // 7. Send success response (don't send the hashed password back)
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(200).json({
            message: 'User registered successfully',
            user: userWithoutPassword
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        // 1. Get email and password from req.body
        const { email, password } = req.body;
        
        // Validate input
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        
        // 2. Find user by email
        const user = findUserByEmail(email);
        
        // 3. Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // 4. Compare password with hashed password using bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // 5. If valid, create JWT token with user info
        const token = jwt.sign(
            { 
            userId: user.id,
            email: user.email
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // 6. Send token back to client
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: userWithoutPassword
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected route that requires authentication
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        // 1. Use the authenticateToken middleware (done above)
        // 2. Get user info from req.user (set by middleware)
        // 3. Fetch complete user data from storage for additional validation
        
        const user = findUserById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // 4. Return comprehensive user profile information
        const { password, ...userProfile } = user;
        
        res.json({
            message: 'Profile accessed successfully',
            user: {
                id: user.id,
                email: user.email,
                registeredAt: user.registeredAt || 'Unknown',
                lastLogin: new Date().toISOString(),
                profileComplete: true
            },
            permissions: {
                canEditProfile: true,
                canDeleteAccount: true,
                canAccessDashboard: true
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
});

// Protected route - user dashboard
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        // 1. Use the authenticateToken middleware (done above)
        // 2. Validate user exists and get additional user data
        // 3. Return dashboard data specific to the logged-in user
        
        const user = findUserById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // 4. Generate user-specific dashboard data
        const userSpecificData = generateUserDashboardData(user);
        
    res.json({
            message: 'Dashboard accessed successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role || 'user'
            },
            dashboardData: userSpecificData,
            accessLevel: 'authenticated',
            sessionInfo: {
                tokenIssuedAt: new Date(req.user.iat * 1000).toISOString(),
                tokenExpiresAt: new Date(req.user.exp * 1000).toISOString(),
                currentTime: new Date().toISOString()
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
});

// Helper function to generate user-specific dashboard data
function generateUserDashboardData(user) {
    // Generate data based on user ID for consistency
    const userIdHash = user.id.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    const baseNumber = Math.abs(userIdHash) % 100;
    
    return {
        totalTasks: baseNumber + 5,
        completedTasks: Math.floor(baseNumber * 0.7),
        pendingTasks: Math.floor(baseNumber * 0.3),
        overdueTasks: Math.floor(baseNumber * 0.1),
        lastLogin: new Date().toISOString(),
        notifications: Math.floor(baseNumber * 0.2) + 1,
        achievements: [
            'First Login',
            'Profile Complete',
            'Dashboard Access'
        ],
            recentActivity: [
            {
                action: 'Profile Viewed',
                timestamp: new Date().toISOString(),
                details: 'User accessed their profile'
            },
            {
                action: 'Dashboard Loaded',
                timestamp: new Date().toISOString(),
                details: 'User accessed dashboard'
            }
        ],
        statistics: {
            loginStreak: Math.floor(baseNumber * 0.1) + 1,
            totalLogins: Math.floor(baseNumber * 0.3) + 1,
            accountAge: Math.floor(baseNumber * 0.5) + 1
        }
    };
}

// User profile update endpoint
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        // 1. Validate user exists
        const user = findUserById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // 2. Get update data from request body
        const { email, currentPassword, newPassword } = req.body;
        
        // 3. Validate current password if changing password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password required to change password' });
            }
            
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
        }
        
        // 4. Prepare updates
        const updates = {};
        
        if (email && email !== user.email) {
            // Check if new email already exists
            const emailExists = findUserByEmail(email);
            if (emailExists && emailExists.id !== req.user.userId) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            updates.email = email;
        }
        
        if (newPassword) {
            const saltRounds = 10;
            updates.password = await bcrypt.hash(newPassword, saltRounds);
        }
        
        updates.updatedAt = new Date().toISOString();
        
        // 5. Update user data
        const success = updateUser(req.user.userId, updates);
        if (!success) {
            return res.status(500).json({ error: 'Failed to update profile' });
        }
        
        // 6. Return updated user data (without password)
        const updatedUser = findUserById(req.user.userId);
        const { password, ...userWithoutPassword } = updatedUser;
        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Logout endpoint with token blacklisting
app.post('/api/logout', authenticateToken, (req, res) => {
    try {
        // In a real application, you would:
        // 1. Add the token to a blacklist
        // 2. Store blacklisted tokens in Redis or database
        // 3. Check blacklist in authenticateToken middleware
        
        // For this exercise, we'll just return success
        // The client should remove the token from storage
        
        res.json({
            message: 'Logged out successfully',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout' });
    }
});

// User account deletion endpoint
app.delete('/api/profile', authenticateToken, async (req, res) => {
    try {
        // 1. Validate user exists
        const user = findUserById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // 2. Require password confirmation for account deletion
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password required to delete account' });
        }
        
        // 3. Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // 4. Delete user
        const success = deleteUser(req.user.userId);
        if (!success) {
            return res.status(500).json({ error: 'Failed to delete account' });
        }
        
        res.json({
            message: 'Account deleted successfully',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Auth API Server running on http://localhost:${PORT}`);
});
