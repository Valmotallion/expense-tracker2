import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../testApp';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Auth Route', () => {
  it('should register and login a new user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'test123',
        role: 'EMPLOYEE',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.token).toBeDefined();
  });
});
