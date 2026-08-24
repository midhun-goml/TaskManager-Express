import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/models/User';
import { Task } from '../src/models/Task';

describe('Task API Endpoints', () => {
  let user1Token: string;
  let user2Token: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({ email: /testtask.*@example\.com/i });
    await Task.deleteMany({});

    // Create User 1
    const res1 = await request(app).post('/auth/register').send({
      name: 'User One',
      email: 'testtask1@example.com',
      password: 'password123',
    });
    user1Token = res1.body.token;

    // Create User 2
    const res2 = await request(app).post('/auth/register').send({
      name: 'User Two',
      email: 'testtask2@example.com',
      password: 'password123',
    });
    user2Token = res2.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: /testtask.*@example\.com/i });
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Task Operations & Authorization', () => {
    it('should reject unauthenticated task creation', async () => {
      const res = await request(app).post('/tasks').send({
        title: 'Unauthorized Task',
      });

      expect(res.status).toBe(401);
    });

    it('should create and retrieve tasks for authenticated user', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'User 1 Task',
          description: 'Task description',
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body).toHaveProperty('id');
      expect(createRes.body.title).toBe('User 1 Task');

      const getRes = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(getRes.status).toBe(200);
      expect(Array.isArray(getRes.body)).toBe(true);
      expect(getRes.body.length).toBe(1);
    });

    it('should prevent User 2 from accessing User 1 task', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'User 1 Private Task' });

      const taskId = createRes.body.id;

      // User 2 tries to fetch User 1's task
      const getRes = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(getRes.status).toBe(404);

      // User 2 tries to delete User 1's task
      const deleteRes = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(deleteRes.status).toBe(404);
    });

    it('should update and delete task for task owner', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'Original Title', completed: false });

      const taskId = createRes.body.id;

      const updateRes = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'Updated Title', completed: true });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated Title');
      expect(updateRes.body.completed).toBe(true);

      const deleteRes = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(deleteRes.status).toBe(200);
    });
  });
});
