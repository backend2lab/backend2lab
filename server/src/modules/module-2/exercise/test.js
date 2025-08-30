// Test Cases for Hello World Server
// These are the test cases that your server should pass

const { expect } = require('chai');
const request = require('supertest');

describe('Hello World Server', () => {
  it('should return 200 OK and correct JSON for GET /', async () => {
    const response = await request('http://localhost:3000')
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).to.deep.equal({ message: 'Hello, World!' });
  });

  it('should return 404 for GET /hello', async () => {
    await request('http://localhost:3000')
      .get('/hello')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('should return 404 for POST /', async () => {
    await request('http://localhost:3000')
      .post('/')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('should return 404 for PUT /', async () => {
    await request('http://localhost:3000')
      .put('/')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('should return 404 for DELETE /', async () => {
    await request('http://localhost:3000')
      .delete('/')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('should return 404 for GET /api', async () => {
    await request('http://localhost:3000')
      .get('/api')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('should return 404 for GET /users', async () => {
    await request('http://localhost:3000')
      .get('/users')
      .expect(404)
      .expect('Content-Type', /json/);
  });
});
