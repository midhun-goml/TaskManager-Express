import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/models/User';

describe('Auth API Endpoints', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({ email: /test.*@example\.com/i });
  });

  afterAll(async () => {
    await User.deleteMany({ email: /test.*@example\.com/i });
    await mongoose.connection.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/auth/register').send({
        name: 'Test User',
        email: 'testregister@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'testregister@example.com');
    });

    it('should reject registration with existing email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'testregister@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/auth/register').send({
        name: 'Test User 2',
        email: 'testregister@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      await request(app).post('/auth/register').send({
        name: 'Login User',
        email: 'testlogin@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/auth/login').send({
        email: 'testlogin@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'Login User');
    });

    it('should reject login with wrong password', async () => {
      await request(app).post('/auth/register').send({
        name: 'Login User',
        email: 'testlogin@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/auth/login').send({
        email: 'testlogin@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return logout confirmation message', async () => {
      const res = await request(app).post('/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Logged out');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should return generic success response', async () => {
      const res = await request(app).post('/auth/forgot-password').send({
        email: 'testforgot@example.com',
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('If an account exists');
    });
  });
});
