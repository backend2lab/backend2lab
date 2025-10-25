const { expect } = require('chai');
const request = require('supertest');

describe('Middleware Exercise', () => {

  describe('Public Routes', () => {
    it('should return welcome message for GET /', async () => {
      const response = await request('http://localhost:3000')
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Welcome! This is a public page.');
    });

    it('should return about message for GET /about', async () => {
      const response = await request('http://localhost:3000')
        .get('/about')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'About page - open to everyone');
    });
  });

  describe('Protected Routes - Without Authorization', () => {
    it('should return 401 for GET /profile without auth header', async () => {
      const response = await request('http://localhost:3000')
        .get('/profile')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Authorization required');
    });

    it('should return 401 for GET /settings without auth header', async () => {
      const response = await request('http://localhost:3000')
        .get('/settings')
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('error', 'Authorization required');
    });
  });

  describe('Protected Routes - With Authorization', () => {
    it('should return profile data for GET /profile with auth header', async () => {
      const response = await request('http://localhost:3000')
        .get('/profile')
        .set('Authorization', 'Bearer token123')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Your profile data');
      expect(response.body).to.have.property('user', 'John Doe');
    });

    it('should return settings data for GET /settings with auth header', async () => {
      const response = await request('http://localhost:3000')
        .get('/settings')
        .set('Authorization', 'Bearer token123')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Your settings');
      expect(response.body).to.have.property('theme', 'dark');
    });

    it('should work with any authorization header value', async () => {
      const response = await request('http://localhost:3000')
        .get('/profile')
        .set('Authorization', 'Basic dXNlcjpwYXNz')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('message', 'Your profile data');
    });
  });

  describe('Other endpoints', () => {
    it('should return 404 for POST /profile', async () => {
      await request('http://localhost:3000')
        .post('/profile')
        .expect(404);
    });

    it('should return 404 for PUT /settings', async () => {
      await request('http://localhost:3000')
        .put('/settings')
        .expect(404);
    });

    it('should return 404 for DELETE /profile', async () => {
      await request('http://localhost:3000')
        .delete('/profile')
        .expect(404);
    });
  });
});
