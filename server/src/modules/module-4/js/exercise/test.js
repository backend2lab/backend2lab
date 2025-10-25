// Test Cases for RESTful Books API
// These are the test cases that your server should pass

const { expect } = require('chai');
const request = require('supertest');

describe('RESTful Books API', () => {
  it('should return 200 OK and all books for GET /books', async () => {
    const response = await request('http://localhost:3000')
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    expect(response.body[0]).to.have.property('id');
    expect(response.body[0]).to.have.property('title');
    expect(response.body[0]).to.have.property('author');
  });

  it('should return 200 OK and single book for GET /books/1', async () => {
    const response = await request('http://localhost:3000')
      .get('/books/1')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).to.have.property('id', 1);
    expect(response.body).to.have.property('title');
    expect(response.body).to.have.property('author');
  });

  it('should return 404 for GET /books/999 (non-existent book)', async () => {
    const response = await request('http://localhost:3000')
      .get('/books/999')
      .expect(404)
      .expect('Content-Type', /json/);

    expect(response.body).to.have.property('error');
  });

  it('should return 201 Created for POST /books', async () => {
    const newBook = {
      title: 'Test Book',
      author: 'Test Author'
    };

    const response = await request('http://localhost:3000')
      .post('/books')
      .send(newBook)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body).to.have.property('id');
    expect(response.body).to.have.property('title', newBook.title);
    expect(response.body).to.have.property('author', newBook.author);
  });

  it('should return 200 OK for PUT /books/1', async () => {
    const updateData = { title: 'Updated Book Title' };

    const response = await request('http://localhost:3000')
      .put('/books/1')
      .send(updateData)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).to.have.property('title', updateData.title);
  });

  it('should return 404 for PUT /books/999 (non-existent book)', async () => {
    await request('http://localhost:3000')
      .put('/books/999')
      .send({ title: 'Updated' })
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('should return 204 No Content for DELETE /books/2', async () => {
    await request('http://localhost:3000')
      .delete('/books/2')
      .expect(204);
  });

  it('should return 404 for DELETE /books/999 (non-existent book)', async () => {
    const response = await request('http://localhost:3000')
      .delete('/books/999')
      .expect(404)
      .expect('Content-Type', /json/);

    expect(response.body).to.have.property('error');
  });

  it('should return 404 for GET /nonexistent', async () => {
    await request('http://localhost:3000')
      .get('/nonexistent')
      .expect(404);
  });

  it('should return 404 for POST /books/1', async () => {
    await request('http://localhost:3000')
      .post('/books/1')
      .send({ title: 'Test' })
      .expect(404);
  });

  it('should return 404 for PUT /books', async () => {
    await request('http://localhost:3000')
      .put('/books')
      .send({ title: 'Test' })
      .expect(404);
  });

  it('should return 404 for DELETE /books', async () => {
    await request('http://localhost:3000')
      .delete('/books')
      .expect(404);
  });
});
