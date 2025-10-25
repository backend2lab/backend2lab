# Module 9: Authentication & Security

## What is Authentication?

Authentication is the process of verifying who a user is. It's like showing your ID card to prove you are who you say you are.

## Authentication vs Authorization

- **Authentication**: "Who are you?" (verifying identity)
- **Authorization**: "What can you do?" (verifying permissions)

```javascript
// Authentication: Login process
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Verify credentials
    if (isValidUser(username, password)) {
        // Create token for authenticated user
        const token = createToken(username);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Authorization: Check permissions
app.get('/admin', authenticateToken, (req, res) => {
    if (req.user.role === 'admin') {
        res.json({ message: 'Admin panel' });
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
});
```

## Common Authentication Methods

### 1. Session-Based Authentication

Uses server-side sessions with cookies:

```javascript
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (isValidUser(username, password)) {
        req.session.userId = getUserId(username);
        res.json({ message: 'Logged in successfully' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
```

### 2. JWT (JSON Web Token) Authentication

Stateless authentication using tokens:

```javascript
const jwt = require('jsonwebtoken');

// Create token
function createToken(user) {
    return jwt.sign(
        { userId: user.id, username: user.username },
        'your-secret-key',
        { expiresIn: '24h' }
    );
}

// Verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}
```

## Password Security

### Hashing Passwords

Never store plain text passwords! Always hash them:

```javascript
const bcrypt = require('bcrypt');

// Hash password when creating user
async function createUser(username, password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Store username and hashedPassword in database
    return { username, password: hashedPassword };
}

// Verify password during login
async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
```

### Password Requirements

Implement strong password policies:

```javascript
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
```

## Security Middleware

### Rate Limiting

Prevent brute force attacks:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/login', loginLimiter);
```

### CORS (Cross-Origin Resource Sharing)

Control which domains can access your API:

```javascript
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true
}));
```

### Helmet.js

Set security headers:

```javascript
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
```

## Common Security Vulnerabilities

### 1. SQL Injection

**Bad:**
```javascript
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**Good:**
```javascript
const query = 'SELECT * FROM users WHERE username = ?';
db.query(query, [username]);
```

### 2. XSS (Cross-Site Scripting)

**Bad:**
```javascript
res.send(`<h1>Hello ${req.body.name}</h1>`);
```

**Good:**
```javascript
const escapeHtml = require('escape-html');
res.send(`<h1>Hello ${escapeHtml(req.body.name)}</h1>`);
```

### 3. CSRF (Cross-Site Request Forgery)

Use CSRF tokens:

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get('/form', (req, res) => {
    res.render('form', { csrfToken: req.csrfToken() });
});
```

## Role-Based Access Control (RBAC)

Implement different permission levels:

```javascript
const roles = {
    admin: ['read', 'write', 'delete', 'admin'],
    moderator: ['read', 'write'],
    user: ['read']
};

function checkPermission(requiredPermission) {
    return (req, res, next) => {
        const userRole = req.user.role;
        const userPermissions = roles[userRole] || [];
        
        if (userPermissions.includes(requiredPermission)) {
            next();
        } else {
            res.status(403).json({ error: 'Insufficient permissions' });
        }
    };
}

// Usage
app.delete('/users/:id', authenticateToken, checkPermission('delete'), (req, res) => {
    // Delete user logic
});
```

## Environment Variables

Never hardcode secrets in your code:

```javascript
// .env file
JWT_SECRET=your-super-secret-jwt-key
DB_PASSWORD=your-database-password
API_KEY=your-api-key

// In your code
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const dbPassword = process.env.DB_PASSWORD;
```

## Security Best Practices

1. **Always validate input** - Sanitize and validate all user input
2. **Use HTTPS** - Encrypt data in transit
3. **Keep dependencies updated** - Regularly update npm packages
4. **Log security events** - Monitor for suspicious activity
5. **Implement proper error handling** - Don't expose sensitive information
6. **Use strong secrets** - Generate cryptographically secure random keys
7. **Regular security audits** - Review code for vulnerabilities

## Testing Security

```javascript
// Test authentication
describe('Authentication', () => {
    it('should reject invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'wrong', password: 'wrong' })
            .expect(401);
        
        expect(response.body.error).to.equal('Invalid credentials');
    });
    
    it('should require authentication for protected routes', async () => {
        await request(app)
            .get('/profile')
            .expect(401);
    });
});
```

Remember: Security is not optional - it's essential for protecting your users and your application!
