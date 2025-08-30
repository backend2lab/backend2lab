# Module 4: RESTful API Design

## What is REST?

REST (Representational State Transfer) is a set of guidelines for designing APIs. It makes APIs predictable, organized, and easy to use.

## REST Principles

### 1. Resource-Based URLs
Think of your API as managing "resources" (things like users, products, orders). Each resource gets its own URL pattern.

```javascript
// Good REST URLs
GET    /users          // Get all users
GET    /users/123      // Get user with ID 123
POST   /users          // Create a new user
PUT    /users/123      // Update user 123
DELETE /users/123      // Delete user 123
```

### 2. Use HTTP Methods Correctly

Each HTTP method has a specific purpose:

- **GET**: Retrieve data (read-only)
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources

```javascript
// Don't do this (non-RESTful)
POST /getUserById
POST /deleteUser
POST /updateUser

// Do this (RESTful)
GET    /users/123
DELETE /users/123
PUT    /users/123
```

### 3. Consistent URL Patterns

Follow predictable patterns:

```javascript
// Collection routes (multiple items)
GET    /products       // Get all products
POST   /products       // Create new product

// Individual routes (single item)
GET    /products/456   // Get product 456
PUT    /products/456   // Update product 456
DELETE /products/456   // Delete product 456
```

## HTTP Status Codes in REST

Use appropriate status codes to communicate what happened:

### Success Codes
- **200 OK**: Request successful (GET, PUT)
- **201 Created**: New resource created (POST)
- **204 No Content**: Successful deletion (DELETE)

### Client Error Codes
- **400 Bad Request**: Invalid data sent
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource already exists

### Server Error Codes
- **500 Internal Server Error**: Something went wrong on server

```javascript
// Example usage
app.post('/users', (req, res) => {
    const user = createUser(req.body);
    res.status(201).json(user);  // 201 Created
});

app.get('/users/999', (req, res) => {
    const user = findUser(999);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);  // 200 OK
});
```

## JSON Request and Response Format

REST APIs typically use JSON for data exchange:

### Request Body (POST/PUT)
```javascript
// Client sends this
{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}
```

### Response Body
```javascript
// Server responds with this
{
    "id": 123,
    "name": "John Doe", 
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-15T10:30:00Z"
}
```

## Express.js REST Implementation

Here's how REST looks in Express:

```javascript
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// GET all users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET single user
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// POST new user
app.post('/users', (req, res) => {
    const newUser = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT update user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    res.json(user);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(index, 1);
    res.status(204).send(); // No content
});
```

## REST API Design Best Practices

### 1. Use Nouns, Not Verbs
```javascript
// Bad
GET /getUsers
POST /createUser
DELETE /removeUser

// Good  
GET /users
POST /users
DELETE /users/:id
```

### 2. Be Consistent
```javascript
// Keep naming consistent
/users
/products
/orders

// Not
/users
/product
/order-items
```

### 3. Use Plural Nouns
```javascript
// Preferred
/users
/products
/categories

// Avoid
/user
/product
/category
```

### 4. Handle Errors Gracefully
```javascript
app.get('/users/:id', (req, res) => {
    try {
        const user = findUser(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});
```

## Testing REST APIs

Use tools like:
- **Postman**: GUI for testing APIs
- **curl**: Command-line tool
- **Browser**: For GET requests only

```bash
# curl examples
curl http://localhost:3000/users
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"John"}'
```

## Key Takeaways

- REST is about organizing APIs around resources
- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- URLs should be predictable and resource-based
- Return appropriate status codes
- Use JSON for data exchange
- Keep APIs consistent and intuitive
