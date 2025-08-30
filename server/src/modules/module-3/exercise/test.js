// Test Cases for Express Routes Exercise
// These are the test cases that your server should pass

const { expect } = require('chai');
const request = require('supertest');

describe('Express Routes Server', () => {
  it('should return 200 OK and "Welcome to Express!" for GET /', async () => {
    const response = await request('http://localhost:3000')
      .get('/')
      .expect(200)
      .expect('Content-Type', /text/);

    expect(response.text).to.equal('Welcome to Express!');
  });

  it('should return 200 OK and about message for GET /about', async () => {
    const response = await request('http://localhost:3000')
      .get('/about')
      .expect(200)
      .expect('Content-Type', /text/);

    expect(response.text).to.include('My name is');
  });

  it('should return 200 OK and correct JSON for GET /api/user', async () => {
    const response = await request('http://localhost:3000')
      .get('/api/user')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).to.deep.equal({ 
      id: 1, 
      name: "John Doe", 
      email: "john@example.com" 
    });
  });

  it('should return 404 for GET /nonexistent', async () => {
    await request('http://localhost:3000')
      .get('/nonexistent')
      .expect(404);
  });

  it('should return 404 for GET /api', async () => {
    await request('http://localhost:3000')
      .get('/api')
      .expect(404);
  });

  it('should return 404 for GET /users', async () => {
    await request('http://localhost:3000')
      .get('/users')
      .expect(404);
  });

  it('should return 404 for POST /', async () => {
    await request('http://localhost:3000')
      .post('/')
      .expect(404);
  });

  it('should return 404 for PUT /', async () => {
    await request('http://localhost:3000')
      .put('/')
      .expect(404);
  });

  it('should return 404 for DELETE /', async () => {
    await request('http://localhost:3000')
      .delete('/')
      .expect(404);
  });

  it('should return 404 for GET /about/extra', async () => {
    await request('http://localhost:3000')
      .get('/about/extra')
      .expect(404);
  });

  it('should return 404 for GET /api/user/extra', async () => {
    await request('http://localhost:3000')
      .get('/api/user/extra')
      .expect(404);
  });
});
