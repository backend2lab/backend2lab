const { expect } = require('chai');
const request = require('supertest');

describe('Pagination and Filtering Exercise', () => {
  describe('GET /api/users', () => {
    it('should return paginated users with default parameters', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('data');
      expect(response.body).to.have.property('pagination');
      expect(response.body).to.have.property('filters');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(5); // Default limit is 5
      expect(response.body.pagination).to.have.property('page', 1);
      expect(response.body.pagination).to.have.property('limit', 5);
      expect(response.body.pagination).to.have.property('total', 15);
      expect(response.body.pagination).to.have.property('totalPages', 3);
      expect(response.body.filters).to.have.property('search', null);
      expect(response.body.filters).to.have.property('role', null);
      expect(response.body.filters).to.have.property('status', null);
    });

    it('should return first page with correct users', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?page=1&limit=3')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(3);
      expect(response.body.data[0]).to.have.property('id', 1);
      expect(response.body.data[0]).to.have.property('name', 'Alice Johnson');
      expect(response.body.data[0]).to.have.property('role', 'admin');
      expect(response.body.data[0]).to.have.property('status', 'active');
      expect(response.body.data[1]).to.have.property('id', 2);
      expect(response.body.data[1]).to.have.property('name', 'Bob Smith');
      expect(response.body.data[1]).to.have.property('role', 'user');
      expect(response.body.data[1]).to.have.property('status', 'active');
      expect(response.body.data[2]).to.have.property('id', 3);
      expect(response.body.data[2]).to.have.property('name', 'Charlie Brown');
      expect(response.body.data[2]).to.have.property('role', 'user');
      expect(response.body.data[2]).to.have.property('status', 'inactive');
      expect(response.body.pagination).to.have.property('page', 1);
      expect(response.body.pagination).to.have.property('limit', 3);
      expect(response.body.pagination).to.have.property('total', 15);
      expect(response.body.pagination).to.have.property('totalPages', 5);
    });

    it('should filter users by role', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?role=admin')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
      expect(response.body.data.every(user => user.role === 'admin')).to.be.true;
      expect(response.body.pagination).to.have.property('total', 4); // 4 admin users
      expect(response.body.filters).to.have.property('role', 'admin');
      expect(response.body.filters).to.have.property('search', null);
      expect(response.body.filters).to.have.property('status', null);
    });

    it('should filter users by status', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?status=active')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
      expect(response.body.data.every(user => user.status === 'active')).to.be.true;
      expect(response.body.pagination).to.have.property('total', 10); // 10 active users
      expect(response.body.filters).to.have.property('status', 'active');
      expect(response.body.filters).to.have.property('role', null);
      expect(response.body.filters).to.have.property('search', null);
    });

    it('should search users by name', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?search=john')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
      expect(response.body.data.every(user => 
        user.name.toLowerCase().includes('john') || 
        user.email.toLowerCase().includes('john')
      )).to.be.true;
      expect(response.body.pagination).to.have.property('total', 2); // Alice Johnson, Mike Johnson
      expect(response.body.filters).to.have.property('search', 'john');
      expect(response.body.filters).to.have.property('role', null);
      expect(response.body.filters).to.have.property('status', null);
    });

    it('should search users by email', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?search=alice@example.com')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(1);
      expect(response.body.data[0]).to.have.property('name', 'Alice Johnson');
      expect(response.body.data[0]).to.have.property('email', 'alice@example.com');
      expect(response.body.pagination).to.have.property('total', 1);
      expect(response.body.filters).to.have.property('search', 'alice@example.com');
    });

    it('should combine role and status filters', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?role=user&status=active')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
      expect(response.body.data.every(user => 
        user.role === 'user' && user.status === 'active'
      )).to.be.true;
      expect(response.body.pagination).to.have.property('total', 5); // 5 active users
      expect(response.body.filters).to.have.property('role', 'user');
      expect(response.body.filters).to.have.property('status', 'active');
      expect(response.body.filters).to.have.property('search', null);
    });

    it('should combine search and role filters', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?search=alice&role=admin')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(1);
      expect(response.body.data[0]).to.have.property('name', 'Alice Johnson');
      expect(response.body.data[0]).to.have.property('role', 'admin');
      expect(response.body.pagination).to.have.property('total', 1);
      expect(response.body.filters).to.have.property('search', 'alice');
      expect(response.body.filters).to.have.property('role', 'admin');
      expect(response.body.filters).to.have.property('status', null);
    });

    it('should combine all filters', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?search=alice&role=admin&status=active')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(1);
      expect(response.body.data[0]).to.have.property('name', 'Alice Johnson');
      expect(response.body.data[0]).to.have.property('role', 'admin');
      expect(response.body.data[0]).to.have.property('status', 'active');
      expect(response.body.pagination).to.have.property('total', 1);
      expect(response.body.filters).to.have.property('search', 'alice');
      expect(response.body.filters).to.have.property('role', 'admin');
      expect(response.body.filters).to.have.property('status', 'active');
    });

    it('should handle pagination with filters', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?role=user&page=1&limit=2')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(2);
      expect(response.body.data.every(user => user.role === 'user')).to.be.true;
      expect(response.body.pagination).to.have.property('page', 1);
      expect(response.body.pagination).to.have.property('limit', 2);
      expect(response.body.pagination).to.have.property('total', 8); // 8 users total
      expect(response.body.pagination).to.have.property('totalPages', 4); // 8 users / 2 per page = 4 pages
    });

    it('should return empty results for non-matching filters', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?search=nonexistent')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(0);
      expect(response.body.pagination).to.have.property('total', 0);
      expect(response.body.pagination).to.have.property('totalPages', 0);
      expect(response.body.filters).to.have.property('search', 'nonexistent');
    });

    it('should handle case-insensitive search', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?search=ALICE')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(1);
      expect(response.body.data[0]).to.have.property('name', 'Alice Johnson');
      expect(response.body.pagination).to.have.property('total', 1);
    });

    it('should handle different limit values', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?page=1&limit=10')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(10);
      expect(response.body.pagination).to.have.property('page', 1);
      expect(response.body.pagination).to.have.property('limit', 10);
      expect(response.body.pagination).to.have.property('total', 15);
      expect(response.body.pagination).to.have.property('totalPages', 2);
    });

    it('should handle large limit values', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?page=1&limit=20')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(15);
      expect(response.body.pagination).to.have.property('page', 1);
      expect(response.body.pagination).to.have.property('limit', 20);
      expect(response.body.pagination).to.have.property('total', 15);
      expect(response.body.pagination).to.have.property('totalPages', 1);
    });

    it('should handle page beyond available data', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?page=10&limit=3')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(0);
      expect(response.body.pagination).to.have.property('page', 10);
      expect(response.body.pagination).to.have.property('limit', 3);
      expect(response.body.pagination).to.have.property('total', 15);
      expect(response.body.pagination).to.have.property('totalPages', 5);
    });

    it('should handle invalid page parameter', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?page=abc&limit=3')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(3);
      expect(response.body.pagination).to.have.property('page', 1); // Should default to 1
      expect(response.body.pagination).to.have.property('limit', 3);
    });

    it('should handle invalid limit parameter', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?page=1&limit=xyz')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(5); // Should default to 5
      expect(response.body.pagination).to.have.property('page', 1);
      expect(response.body.pagination).to.have.property('limit', 5); // Should default to 5
    });

    it('should return correct response structure', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?page=1&limit=2')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.all.keys(['data', 'pagination', 'filters']);
      expect(response.body.data).to.be.an('array');
      expect(response.body.pagination).to.be.an('object');
      expect(response.body.filters).to.be.an('object');
      
      // Check pagination structure
      expect(response.body.pagination).to.have.all.keys(['page', 'limit', 'total', 'totalPages']);
      expect(response.body.pagination.page).to.be.a('number');
      expect(response.body.pagination.limit).to.be.a('number');
      expect(response.body.pagination.total).to.be.a('number');
      expect(response.body.pagination.totalPages).to.be.a('number');
      
      // Check filters structure
      expect(response.body.filters).to.have.all.keys(['search', 'role', 'status']);
      
      // Check user object structure
      if (response.body.data.length > 0) {
        const user = response.body.data[0];
        expect(user).to.have.all.keys(['id', 'name', 'email', 'role', 'status']);
        expect(user.id).to.be.a('number');
        expect(user.name).to.be.a('string');
        expect(user.email).to.be.a('string');
        expect(user.role).to.be.a('string');
        expect(user.status).to.be.a('string');
      }
    });

    it('should handle empty search string', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?search=')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(5); // Should return default pagination
      expect(response.body.pagination).to.have.property('total', 15);
      expect(response.body.filters).to.have.property('search', '');
    });

    it('should handle invalid role filter', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?role=invalid')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(0);
      expect(response.body.pagination).to.have.property('total', 0);
      expect(response.body.filters).to.have.property('role', 'invalid');
    });

    it('should handle invalid status filter', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/users?status=invalid')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).to.have.length(0);
      expect(response.body.pagination).to.have.property('total', 0);
      expect(response.body.filters).to.have.property('status', 'invalid');
    });
  });
});
