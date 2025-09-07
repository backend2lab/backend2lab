const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

describe('Authentication & Authorization Exercise', () => {
  const USERS_FILE = path.join(__dirname, 'users.json');
  const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

  // Clean up data file before and after tests
  before(() => {
    if (fs.existsSync(USERS_FILE)) {
      fs.unlinkSync(USERS_FILE);
    }
  });

  afterEach(() => {
    if (fs.existsSync(USERS_FILE)) {
      fs.unlinkSync(USERS_FILE);
    }
  });

  describe('User Registration', () => {
    it('should register a new user with valid email and password', async () => {
      const userData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request('http://localhost:3000')
        .post('/api/register')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user).to.have.property('email', 'john@example.com');
      expect(response.body.user).to.not.have.property('password');
      expect(response.body.message).to.include('registered successfully');
    });

    it('should return 400 when email is missing', async () => {
      const userData = {
        password: 'password123'
      };

      const response = await request('http://localhost:3000')
        .post('/api/register')
        .send(userData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('required');
    });

    it('should return 400 when password is missing', async () => {
      const userData = {
        email: 'john@example.com'
      };

      const response = await request('http://localhost:3000')
        .post('/api/register')
        .send(userData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('required');
    });

    it('should return 400 when user already exists', async () => {
      const userData = {
        email: 'jane@example.com',
        password: 'password123'
      };

      // Register first user
      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData)
        .expect(200);

      // Try to register same user again
      const response = await request('http://localhost:3000')
        .post('/api/register')
        .send(userData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('already exists');
    });

    it('should hash passwords and not store plain text', async () => {
      const userData = {
        email: 'alice@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData)
        .expect(200);

      // Check that password was hashed in the file
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const user = users.find(u => u.email === 'alice@example.com');
      
      expect(user).to.exist;
      expect(user.password).to.not.equal('password123');
      expect(user.password).to.match(/^\$2[aby]\$\d{1,2}\$/); // bcrypt hash pattern
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        email: 'bob@example.com',
        password: 'password123'
      };
      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);
    });

    it('should login with valid credentials and return JWT token', async () => {
      const loginData = {
        email: 'bob@example.com',
        password: 'password123'
      };

      const response = await request('http://localhost:3000')
        .post('/api/login')
        .send(loginData)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('user');
      expect(response.body.message).to.include('Login successful');
      expect(response.body.token).to.be.a('string');
      expect(response.body.user.email).to.equal('bob@example.com');
    });

    it('should return 401 with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request('http://localhost:3000')
        .post('/api/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Invalid credentials');
    });

    it('should return 401 with invalid password', async () => {
      const loginData = {
        email: 'bob@example.com',
        password: 'wrongpassword'
      };

      const response = await request('http://localhost:3000')
        .post('/api/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Invalid credentials');
    });

    it('should return 400 when email is missing', async () => {
      const loginData = {
        password: 'password123'
      };

      const response = await request('http://localhost:3000')
        .post('/api/login')
        .send(loginData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('required');
    });

    it('should return 400 when password is missing', async () => {
      const loginData = {
        email: 'bob@example.com'
      };

      const response = await request('http://localhost:3000')
        .post('/api/login')
        .send(loginData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('required');
    });
  });

  describe('Protected Routes', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create and login a test user
      const userData = {
        email: 'charlie@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send(userData);

      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    });

    it('should access profile route with valid JWT token', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('id', userId);
      expect(response.body.user).to.have.property('email', 'charlie@example.com');
    });

    it('should access dashboard route with valid JWT token', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('dashboardData');
      expect(response.body.user).to.have.property('id', userId);
    });

    it('should return 401 when accessing profile without token', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/profile')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Access token required');
    });

    it('should return 401 when accessing dashboard without token', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/dashboard')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Access token required');
    });

    it('should return 401 when Authorization header is missing', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/profile')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Access token required');
    });

    it('should return 403 with invalid JWT token', async () => {
      const invalidToken = 'invalid.jwt.token';

      const response = await request('http://localhost:3000')
        .get('/api/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(403)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Invalid token');
    });

    it('should return 403 with malformed Authorization header', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/profile')
        .set('Authorization', 'InvalidFormat')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Access token required');
    });
  });

  describe('JWT Token Validation', () => {
    it('should create valid JWT tokens that can be decoded', async () => {
      const userData = {
        email: 'david@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send(userData);

      const token = loginResponse.body.token;
      
      // Verify token can be decoded
      const decoded = jwt.verify(token, JWT_SECRET);
      expect(decoded).to.have.property('userId');
      expect(decoded).to.have.property('email', 'david@example.com');
    });

    it('should include correct user data in JWT payload', async () => {
      const userData = {
        email: 'eve@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send(userData);

      const token = loginResponse.body.token;
      const decoded = jwt.verify(token, JWT_SECRET);
      
      expect(decoded.email).to.equal('eve@example.com');
      expect(decoded).to.have.property('iat'); // issued at
      expect(decoded).to.have.property('exp'); // expiration
    });
  });

  describe('Data Persistence', () => {
    it('should persist user data across server restarts', async () => {
      const userData = {
        email: 'frank@example.com',
        password: 'password123'
      };

      // Register user
      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      // Verify user exists in file
      expect(fs.existsSync(USERS_FILE)).to.be.true;
      
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const user = users.find(u => u.email === 'frank@example.com');
      
      expect(user).to.exist;
      expect(user.password).to.not.equal('password123');
    });

    it('should handle multiple users correctly', async () => {
      const users = [
        { email: 'user1@example.com', password: 'pass1' },
        { email: 'user2@example.com', password: 'pass2' },
        { email: 'user3@example.com', password: 'pass3' }
      ];

      // Register all users
      for (const user of users) {
        await request('http://localhost:3000')
          .post('/api/register')
          .send(user);
      }

      // Verify all users can login
      for (const user of users) {
        const response = await request('http://localhost:3000')
          .post('/api/login')
          .send(user);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
      }
    });
  });

  describe('Enhanced Profile Management', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create and login a test user
      const userData = {
        email: 'profile@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send(userData);

      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    });

    it('should return enhanced profile data with permissions', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('permissions');
      expect(response.body.user).to.have.property('id', userId);
      expect(response.body.user).to.have.property('email', 'profile@example.com');
      expect(response.body.user).to.have.property('registeredAt');
      expect(response.body.user).to.have.property('lastLogin');
      expect(response.body.user).to.have.property('profileComplete', true);
      expect(response.body.permissions).to.have.property('canEditProfile', true);
      expect(response.body.permissions).to.have.property('canDeleteAccount', true);
      expect(response.body.permissions).to.have.property('canAccessDashboard', true);
    });

    it('should update user profile with valid data', async () => {
      const updateData = {
        email: 'updated@example.com'
      };

      const response = await request('http://localhost:3000')
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Profile updated successfully');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('email', 'updated@example.com');
      expect(response.body.user).to.have.property('updatedAt');
    });

    it('should update user password with current password', async () => {
      const updateData = {
        currentPassword: 'password123',
        newPassword: 'newpassword456'
      };

      const response = await request('http://localhost:3000')
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Profile updated successfully');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('updatedAt');

      // Verify new password works
      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send({
          email: 'profile@example.com',
          password: 'newpassword456'
        })
        .expect(200);

      expect(loginResponse.body).to.have.property('token');
    });

    it('should return 400 when updating password without current password', async () => {
      const updateData = {
        newPassword: 'newpassword456'
      };

      const response = await request('http://localhost:3000')
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Current password required to change password');
    });

    it('should return 401 when current password is incorrect', async () => {
      const updateData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword456'
      };

      const response = await request('http://localhost:3000')
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Current password is incorrect');
    });

    it('should return 400 when email already exists', async () => {
      // Create another user first
      await request('http://localhost:3000')
        .post('/api/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });

      const updateData = {
        email: 'existing@example.com'
      };

      const response = await request('http://localhost:3000')
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Email already in use');
    });
  });

  describe('Enhanced Dashboard', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create and login a test user
      const userData = {
        email: 'dashboard@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send(userData);

      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    });

    it('should return enhanced dashboard data with user-specific information', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Dashboard accessed successfully');
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('dashboardData');
      expect(response.body).to.have.property('accessLevel', 'authenticated');
      expect(response.body).to.have.property('sessionInfo');
      
      expect(response.body.user).to.have.property('id', userId);
      expect(response.body.user).to.have.property('email', 'dashboard@example.com');
      expect(response.body.user).to.have.property('role', 'user');
      
      expect(response.body.dashboardData).to.have.property('totalTasks');
      expect(response.body.dashboardData).to.have.property('completedTasks');
      expect(response.body.dashboardData).to.have.property('pendingTasks');
      expect(response.body.dashboardData).to.have.property('overdueTasks');
      expect(response.body.dashboardData).to.have.property('notifications');
      expect(response.body.dashboardData).to.have.property('achievements');
      expect(response.body.dashboardData).to.have.property('recentActivity');
      expect(response.body.dashboardData).to.have.property('statistics');
      
      expect(response.body.sessionInfo).to.have.property('tokenIssuedAt');
      expect(response.body.sessionInfo).to.have.property('tokenExpiresAt');
      expect(response.body.sessionInfo).to.have.property('currentTime');
      
      // Verify achievements array
      expect(response.body.dashboardData.achievements).to.be.an('array');
      expect(response.body.dashboardData.achievements).to.include('First Login');
      expect(response.body.dashboardData.achievements).to.include('Profile Complete');
      expect(response.body.dashboardData.achievements).to.include('Dashboard Access');
      
      // Verify recent activity array
      expect(response.body.dashboardData.recentActivity).to.be.an('array');
      expect(response.body.dashboardData.recentActivity).to.have.length.greaterThan(0);
      
      // Verify statistics object
      expect(response.body.dashboardData.statistics).to.have.property('loginStreak');
      expect(response.body.dashboardData.statistics).to.have.property('totalLogins');
      expect(response.body.dashboardData.statistics).to.have.property('accountAge');
    });

    it('should return consistent data for the same user', async () => {
      const response1 = await request('http://localhost:3000')
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request('http://localhost:3000')
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // User-specific data should be consistent
      expect(response1.body.dashboardData.totalTasks).to.equal(response2.body.dashboardData.totalTasks);
      expect(response1.body.dashboardData.completedTasks).to.equal(response2.body.dashboardData.completedTasks);
      expect(response1.body.dashboardData.statistics.loginStreak).to.equal(response2.body.dashboardData.statistics.loginStreak);
    });
  });

  describe('Logout Functionality', () => {
    let authToken;

    beforeEach(async () => {
      // Create and login a test user
      const userData = {
        email: 'logout@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send(userData);

      authToken = loginResponse.body.token;
    });

    it('should logout successfully with valid token', async () => {
      const response = await request('http://localhost:3000')
        .post('/api/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Logged out successfully');
      expect(response.body).to.have.property('timestamp');
    });

    it('should return 401 when logging out without token', async () => {
      const response = await request('http://localhost:3000')
        .post('/api/logout')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Access token required');
    });
  });

  describe('Account Deletion', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create and login a test user
      const userData = {
        email: 'delete@example.com',
        password: 'password123'
      };

      await request('http://localhost:3000')
        .post('/api/register')
        .send(userData);

      const loginResponse = await request('http://localhost:3000')
        .post('/api/login')
        .send(userData);

      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    });

    it('should delete account with correct password', async () => {
      const response = await request('http://localhost:3000')
        .delete('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'password123' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Account deleted successfully');
      expect(response.body).to.have.property('timestamp');

      // Verify user can no longer login
      await request('http://localhost:3000')
        .post('/api/login')
        .send({
          email: 'delete@example.com',
          password: 'password123'
        })
        .expect(401);
    });

    it('should return 400 when password is missing for deletion', async () => {
      const response = await request('http://localhost:3000')
        .delete('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Password required to delete account');
    });

    it('should return 401 when password is incorrect for deletion', async () => {
      const response = await request('http://localhost:3000')
        .delete('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'wrongpassword' })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Invalid password');
    });

    it('should return 401 when deleting account without token', async () => {
      const response = await request('http://localhost:3000')
        .delete('/api/profile')
        .send({ password: 'password123' })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Access token required');
    });
  });
});

