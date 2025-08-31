const { expect } = require('chai');
const request = require('supertest');

describe('User Registration Validator', () => {

  describe('POST /register', () => {
    it('should return 201 and success response for valid user data', async () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(validUser)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message', 'User registered successfully');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('name', 'John Doe');
      expect(response.body.user).to.have.property('email', 'john@example.com');
      expect(response.body.user).to.have.property('age', 25);
    });

    it('should return 201 for valid user data without age', async () => {
      const validUser = {
        name: 'Jane Smith',
        email: 'jane@example.com'
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(validUser)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', true);
      expect(response.body.user).to.have.property('age', null);
    });

    it('should return 400 when name is missing', async () => {
      const invalidUser = {
        email: 'test@example.com',
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Name is required');
    });

    it('should return 400 when name is empty string', async () => {
      const invalidUser = {
        name: '',
        email: 'test@example.com',
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Name is required');
    });

    it('should return 400 when name is only whitespace', async () => {
      const invalidUser = {
        name: '   ',
        email: 'test@example.com',
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Name is required');
    });

    it('should return 400 when email is missing', async () => {
      const invalidUser = {
        name: 'Test User',
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Email is required');
    });

    it('should return 400 when email is empty string', async () => {
      const invalidUser = {
        name: 'Test User',
        email: '',
        age: 30
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Email is required');
    });

    it('should return 400 when age is negative', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: -5
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Age must be a positive number');
    });

    it('should return 400 when age is zero', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: 0
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Age must be a positive number');
    });

    it('should return 400 when age is a string', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: '25'
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'Age must be a positive number');
    });

    it('should trim whitespace from name and email in success response', async () => {
      const userWithWhitespace = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        age: 25
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(userWithWhitespace)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body.user).to.have.property('name', 'John Doe');
      expect(response.body.user).to.have.property('email', 'john@example.com');
    });

    it('should handle multiple validation errors (first error should be returned)', async () => {
      const invalidUser = {
        name: '',
        email: '',
        age: -5
      };

      const response = await request('http://localhost:3000')
        .post('/register')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error');
      // Should return the first validation error (name is required)
      expect(response.body.error).to.equal('Name is required');
    });
  });

  describe('Other endpoints', () => {
    it('should return 404 for GET /register', async () => {
      await request('http://localhost:3000')
        .get('/register')
        .expect(404);
    });

    it('should return 404 for PUT /register', async () => {
      await request('http://localhost:3000')
        .put('/register')
        .expect(404);
    });

    it('should return 404 for DELETE /register', async () => {
      await request('http://localhost:3000')
        .delete('/register')
        .expect(404);
    });

    it('should return 404 for GET /', async () => {
      await request('http://localhost:3000')
        .get('/')
        .expect(404);
    });
  });
});
