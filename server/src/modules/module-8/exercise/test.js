const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

describe('Data Persistence Exercise', () => {
  const DATA_FILE = path.join(__dirname, 'users.json');

  // Clean up data file before each test
  before(() => {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  });

  // Clean up data file after each test
  afterEach(() => {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  });

  describe('GET /users', () => {
    it('should return empty array when no users exist', async () => {
      const response = await request('http://localhost:3000')
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(0);
    });

    it('should return all users when they exist', async () => {
      // Create a test user first
      const testUser = { name: 'John Doe', email: 'john@example.com', age: 30 };
      
      await request('http://localhost:3000')
        .post('/users')
        .send(testUser)
        .expect(201);

      const response = await request('http://localhost:3000')
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(1);
      expect(response.body[0]).to.have.property('name', 'John Doe');
      expect(response.body[0]).to.have.property('email', 'john@example.com');
      expect(response.body[0]).to.have.property('age', 30);
      expect(response.body[0]).to.have.property('id');
    });
  });

  describe('POST /users', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25
      };

      const response = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name', 'Jane Smith');
      expect(response.body).to.have.property('email', 'jane@example.com');
      expect(response.body).to.have.property('age', 25);
    });

    it('should create a user without age', async () => {
      const userData = {
        name: 'Bob Wilson',
        email: 'bob@example.com'
      };

      const response = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name', 'Bob Wilson');
      expect(response.body).to.have.property('email', 'bob@example.com');
      expect(response.body).to.have.property('age', null);
    });

    it('should return 400 when name is missing', async () => {
      const userData = {
        email: 'test@example.com',
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Name and email are required');
    });

    it('should return 400 when email is missing', async () => {
      const userData = {
        name: 'Test User',
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Name and email are required');
    });

    it('should return 400 when both name and email are missing', async () => {
      const userData = {
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Name and email are required');
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by ID when user exists', async () => {
      // Create a user first
      const userData = { name: 'Alice Johnson', email: 'alice@example.com' };
      
      const createResponse = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.id;

      const response = await request('http://localhost:3000')
        .get(`/users/${userId}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('id', userId);
      expect(response.body).to.have.property('name', 'Alice Johnson');
      expect(response.body).to.have.property('email', 'alice@example.com');
    });

    it('should return 404 when user does not exist', async () => {
      const response = await request('http://localhost:3000')
        .get('/users/999999')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'User not found');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user when user exists', async () => {
      // Create a user first
      const userData = { name: 'Charlie Brown', email: 'charlie@example.com', age: 28 };
      
      const createResponse = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.id;

      // Update the user
      const updateData = { name: 'Charlie Wilson', age: 29 };

      const response = await request('http://localhost:3000')
        .put(`/users/${userId}`)
        .send(updateData)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('id', userId);
      expect(response.body).to.have.property('name', 'Charlie Wilson');
      expect(response.body).to.have.property('email', 'charlie@example.com');
      expect(response.body).to.have.property('age', 29);
    });

    it('should return 404 when updating non-existent user', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request('http://localhost:3000')
        .put('/users/999999')
        .send(updateData)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'User not found');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user when user exists', async () => {
      // Create a user first
      const userData = { name: 'David Lee', email: 'david@example.com' };
      
      const createResponse = await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.id;

      // Delete the user
      const response = await request('http://localhost:3000')
        .delete(`/users/${userId}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'User deleted successfully');

      // Verify user is deleted
      await request('http://localhost:3000')
        .get(`/users/${userId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent user', async () => {
      const response = await request('http://localhost:3000')
        .delete('/users/999999')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'User not found');
    });
  });

  describe('Data Persistence', () => {
    it('should persist data across requests', async () => {
      // Create a user
      const userData = { name: 'Eve Adams', email: 'eve@example.com' };
      
      await request('http://localhost:3000')
        .post('/users')
        .send(userData)
        .expect(201);

      // Verify user exists in GET request
      const getResponse = await request('http://localhost:3000')
        .get('/users')
        .expect(200);

      expect(getResponse.body).to.have.length(1);
      expect(getResponse.body[0]).to.have.property('name', 'Eve Adams');

      // Verify data file was created
      expect(fs.existsSync(DATA_FILE)).to.be.true;
    });

    it('should handle multiple users correctly', async () => {
      // Create multiple users
      const users = [
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' },
        { name: 'User 3', email: 'user3@example.com' }
      ];

      for (const user of users) {
        await request('http://localhost:3000')
          .post('/users')
          .send(user)
          .expect(201);
      }

      // Verify all users exist
      const response = await request('http://localhost:3000')
        .get('/users')
        .expect(200);

      expect(response.body).to.have.length(3);
      expect(response.body.map(u => u.name)).to.include.members(['User 1', 'User 2', 'User 3']);
    });
  });
});
