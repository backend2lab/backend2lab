const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Enable JSON parsing
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'users.json');

function saveUsers(users) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving users:', error.message);
        return false;
    }
}

function loadUsers() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('No users file found, returning empty array');
        return [];
    }
}

// GET /users - Get all users
app.get('/users', (req, res) => {
    try {
        const users = loadUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load users' });
    }
});

// POST /users - Create a new user
app.post('/users', (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        // Load existing users
        const users = loadUsers();
        
        // Create new user with ID
        const newUser = {
            id: Date.now(),
            name,
            email,
            age: age || null
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to file
        const saved = saveUsers(users);
        if (!saved) {
            return res.status(500).json({ error: 'Failed to save user' });
        }
        
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
    try {
        const users = loadUsers();
        const user = users.find(u => u.id === parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load user' });
    }
});

// PUT /users/:id - Update user
app.put('/users/:id', (req, res) => {
    try {
        const { name, email, age } = req.body;
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update user fields
        users[userIndex] = {
            ...users[userIndex],
            ...(name && { name }),
            ...(email && { email }),
            ...(age !== undefined && { age })
        };
        
        const saved = saveUsers(users);
        if (!saved) {
            return res.status(500).json({ error: 'Failed to update user' });
        }
        
        res.json(users[userIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', (req, res) => {
    try {
        const users = loadUsers();
        const filteredUsers = users.filter(u => u.id !== parseInt(req.params.id));
        
        if (filteredUsers.length === users.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const saved = saveUsers(filteredUsers);
        if (!saved) {
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
