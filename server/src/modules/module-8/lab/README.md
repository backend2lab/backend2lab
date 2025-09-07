# Module 8: Data Persistence

## What is Data Persistence?

Data persistence means storing data so it survives after your application stops running. Without persistence, all data is lost when the server restarts.

## Types of Data Storage

### 1. In-Memory (Temporary)
Data stored in variables - lost when app restarts:

```javascript
let users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
];
// Lost when server restarts!
```

### 2. File-Based (Simple Persistence)
Data stored in files - survives restarts:

```javascript
const fs = require('fs');

// Save to file
fs.writeFileSync('users.json', JSON.stringify(users));

// Load from file
const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
```

### 3. Database (Professional Persistence)
Data stored in specialized database systems like MongoDB or PostgreSQL.

## Working with JSON Files

### Writing Data

```javascript
const fs = require('fs');

function saveUsers(users) {
    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        console.log('Users saved successfully');
    } catch (error) {
        console.error('Error saving users:', error);
    }
}
```

### Reading Data

```javascript
function loadUsers() {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        console.log('No users file found, starting fresh');
        return [];
    }
}
```

### Complete CRUD with JSON

```javascript
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

class DataStore {
    // Load data from file
    load() {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
    
    // Save data to file
    save(data) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
    
    // Create new item
    create(item) {
        const data = this.load();
        const newItem = { id: Date.now(), ...item };
        data.push(newItem);
        this.save(data);
        return newItem;
    }
    
    // Read all items
    findAll() {
        return this.load();
    }
    
    // Read one item
    findById(id) {
        const data = this.load();
        return data.find(item => item.id === parseInt(id));
    }
    
    // Update item
    update(id, updates) {
        const data = this.load();
        const index = data.findIndex(item => item.id === parseInt(id));
        
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this.save(data);
            return data[index];
        }
        
        return null;
    }
    
    // Delete item
    delete(id) {
        const data = this.load();
        const filtered = data.filter(item => item.id !== parseInt(id));
        this.save(filtered);
        return data.length !== filtered.length;
    }
}
```

## Introduction to Databases

### Why Use Databases?

JSON files work for learning, but real applications need databases because:
- **Performance**: Fast queries on large datasets
- **Concurrent Access**: Multiple users can access simultaneously
- **Data Integrity**: Built-in validation and constraints
- **Relationships**: Link data between tables/collections
- **Backup & Recovery**: Professional data protection

### Database Types

#### SQL Databases (PostgreSQL, MySQL)
- Structured data in tables with rows and columns
- Use SQL language for queries
- Strong relationships between data

```sql
-- SQL Example
SELECT * FROM users WHERE age > 18;
```

#### NoSQL Databases (MongoDB)
- Flexible document-based storage
- JSON-like documents
- No fixed schema

```javascript
// MongoDB Example
db.users.find({ age: { $gt: 18 } });
```

## Database Connections

### MongoDB with Mongoose

```javascript
const mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost:27017/myapp');

// Define a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

// Create a model
const User = mongoose.model('User', userSchema);

// Use the model
const newUser = new User({
    name: 'John',
    email: 'john@example.com',
    age: 25
});

newUser.save();
```

### PostgreSQL with Sequelize

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// Connect to database
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});

// Define a model
const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER
});

// Use the model
User.create({
    name: 'John',
    email: 'john@example.com',
    age: 25
});
```

## Models and Data Abstraction

Models represent your data structure and business logic:

```javascript
// User model example
class UserModel {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }
    
    async createUser(userData) {
        // Validate data
        if (!userData.email || !userData.name) {
            throw new Error('Email and name are required');
        }
        
        // Check if user exists
        const existing = await this.findByEmail(userData.email);
        if (existing) {
            throw new Error('User already exists');
        }
        
        // Create user
        return this.dataStore.create(userData);
    }
    
    async findByEmail(email) {
        const users = await this.dataStore.findAll();
        return users.find(user => user.email === email);
    }
}
```

## Best Practices

### 1. Separate Data Layer
Keep database logic separate from API routes:

```javascript
// Good: Separate concerns
app.get('/users', async (req, res) => {
    const users = await userModel.getAllUsers();
    res.json(users);
});

// Bad: Mixed concerns
app.get('/users', (req, res) => {
    const data = fs.readFileSync('users.json');
    const users = JSON.parse(data);
    res.json(users);
});
```

### 2. Error Handling
Always handle database errors:

```javascript
app.post('/users', async (req, res) => {
    try {
        const user = await userModel.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

### 3. Environment Configuration
Keep database credentials in environment variables:

```javascript
const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp';
mongoose.connect(dbUrl);
```

## Key Takeaways

- Data persistence saves data beyond application lifecycle
- JSON files are simple but limited
- Databases provide professional data management
- Models abstract data operations
- Always handle database errors
- Separate data logic from API routes
