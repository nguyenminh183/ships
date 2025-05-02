const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Authentication and Authorization Tests', () => {
  let adminToken;
  let staffToken;
  let customerToken;
  let shipperToken;

  // Test data
  const testUsers = {
    admin: {
      name: 'Admin User',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin'
    },
    staff: {
      name: 'Staff User',
      email: 'staff@test.com',
      password: '123456',
      role: 'staff'
    },
    customer: {
      name: 'Customer User',
      email: 'customer@test.com',
      password: '123456',
      role: 'customer'
    },
    shipper: {
      name: 'Shipper User',
      email: 'shipper@test.com',
      password: '123456',
      role: 'shipper'
    }
  };

  // Register all test users
  beforeAll(async () => {
    for (const [role, userData] of Object.entries(testUsers)) {
      const response = await request(app)
        .post('/api/users/register')
        .send(userData);
      
      if (role === 'admin') adminToken = response.body.token;
      if (role === 'staff') staffToken = response.body.token;
      if (role === 'customer') customerToken = response.body.token;
      if (role === 'shipper') shipperToken = response.body.token;
    }
  });

  // Test admin access
  describe('Admin Access Tests', () => {
    test('Admin can access all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Admin can get single user', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('admin');
    });
  });

  // Test staff access
  describe('Staff Access Tests', () => {
    test('Staff cannot access all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${staffToken}`);
      
      expect(response.status).toBe(403);
    });

    test('Staff can access their own profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${staffToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('staff');
    });
  });

  // Test customer access
  describe('Customer Access Tests', () => {
    test('Customer cannot access all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(response.status).toBe(403);
    });

    test('Customer can access their own profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('customer');
    });
  });

  // Test shipper access
  describe('Shipper Access Tests', () => {
    test('Shipper cannot access all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${shipperToken}`);
      
      expect(response.status).toBe(403);
    });

    test('Shipper can access their own profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${shipperToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('shipper');
    });
  });

  // Clean up test data
  afterAll(async () => {
    await User.deleteMany({
      email: {
        $in: Object.values(testUsers).map(user => user.email)
      }
    });
  });
}); 