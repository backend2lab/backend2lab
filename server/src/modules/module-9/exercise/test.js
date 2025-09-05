const { expect } = require('chai');
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication & Security Exercise', () => {
  let server;
  let authToken;
  let testUser;

  before(() => {
    // Import the server app
    server = require('./server');
  });

  after(() => {
    // Clean up
    if (server && server.close) {
      server.close();
    }
  });

  describe('Password Hashing', () => {
    it('should hash passwords correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      expect(hashedPassword).to.be.a('string');
      expect(hashedPassword).to.not.equal(password);
      expect(hashedPassword.length).to.be.greaterThan(50);
    });

    it('should verify passwords correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const isValid = await bcrypt.compare(password, hashedPassword);
      const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
      
      expect(isValid).to.be.true;
      expect(isInvalid).to.be.false;
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate valid JWT tokens', () => {
      const user = { id: 1, username: 'testuser' };
      const token = jwt.sign(user, 'your-super-secret-jwt-key-change-in-production', { expiresIn: '24h' });
      
      expect(token).to.be.a('string');
      expect(token.split('.')).to.have.length(3); // JWT has 3 parts
    });

    it('should verify JWT tokens correctly', () => {
      const user = { id: 1, username: 'testuser' };
      const token = jwt.sign(user, 'your-super-secret-jwt-key-change-in-production', { expiresIn: '24h' });
      
      const decoded = jwt.verify(token, 'your-super-secret-jwt-key-change-in-production');
      
      expect(decoded.id).to.equal(user.id);
      expect(decoded.username).to.equal(user.username);
    });
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'SecurePass123!',
        email: 'test@example.com'
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(userData)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body.message).to.equal('User registered successfully');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user.username).to.equal(userData.username);
      expect(response.body.user.email).to.equal(userData.email);
      expect(response.body.user).to.not.have.property('password');
    });

    it('should reject registration with missing fields', async () => {
      const response = await request('http://localhost:3000')
        .post('/register')
        .send({ username: 'testuser2' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('Username, password, and email are required');
    });

    it('should reject weak passwords', async () => {
      const userData = {
        username: 'testuser3',
        password: 'weak',
        email: 'test3@example.com'
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(userData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.include('Password must be at least 8 characters');
    });

    it('should reject duplicate usernames', async () => {
      const userData = {
        username: 'testuser',
        password: 'SecurePass123!',
        email: 'test4@example.com'
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(userData)
        .expect(409)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('User already exists');
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'SecurePass123!'
      };

      const response = await request('http://localhost:3000')
        .post('/login')
        .send(loginData)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.message).to.equal('Login successful');
      expect(response.body).to.have.property('token');
      expect(response.body.user.username).to.equal(loginData.username);
      expect(response.body.user).to.not.have.property('password');

      // Store token for protected route tests
      authToken = response.body.token;
      testUser = response.body.user;
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const response = await request('http://localhost:3000')
        .post('/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('Invalid credentials');
    });

    it('should reject login with missing fields', async () => {
      const response = await request('http://localhost:3000')
        .post('/login')
        .send({ username: 'testuser' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('Username and password are required');
    });

    it('should reject login for non-existent user', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'SecurePass123!'
      };

      const response = await request('http://localhost:3000')
        .post('/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    it('should access profile with valid token', async () => {
      const response = await request('http://localhost:3000')
        .get('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.message).to.equal('Profile data');
      expect(response.body.user.username).to.equal(testUser.username);
      expect(response.body.user).to.have.property('createdAt');
    });

    it('should access dashboard with valid token', async () => {
      const response = await request('http://localhost:3000')
        .get('/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.message).to.equal('Welcome to your dashboard!');
      expect(response.body.user.username).to.equal(testUser.username);
      expect(response.body.stats).to.have.property('totalUsers');
    });

    it('should reject access without token', async () => {
      const response = await request('http://localhost:3000')
        .get('/profile')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('Access token required');
    });

    it('should reject access with invalid token', async () => {
      const response = await request('http://localhost:3000')
        .get('/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('Invalid or expired token');
    });

    it('should reject access with malformed authorization header', async () => {
      const response = await request('http://localhost:3000')
        .get('/profile')
        .set('Authorization', 'InvalidFormat')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body.error).to.equal('Access token required');
    });
  });

  describe('Public Routes', () => {
    it('should access public home route', async () => {
      const response = await request('http://localhost:3000')
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.message).to.equal('Welcome to the Authentication API!');
    });
  });

  describe('Password Validation', () => {
    it('should validate password requirements', async () => {
      const testCases = [
        { password: 'short', expected: 'at least 8 characters' },
        { password: 'nouppercase123!', expected: 'uppercase letter' },
        { password: 'NOLOWERCASE123!', expected: 'lowercase letter' },
        { password: 'NoNumbers!', expected: 'number' },
        { password: 'NoSpecialChars123', expected: 'special character' },
        { password: 'ValidPass123!', expected: null } // Should pass
      ];

      for (const testCase of testCases) {
        const userData = {
          username: `testuser_${Date.now()}`,
          password: testCase.password,
          email: `test_${Date.now()}@example.com`
        };

        if (testCase.expected) {
          const response = await request('http://localhost:3000')
            .post('/register')
            .send(userData)
            .expect(400);

          expect(response.body.error).to.include(testCase.expected);
        } else {
          await request('http://localhost:3000')
            .post('/register')
            .send(userData)
            .expect(201);
        }
      }
    });
  });
});
