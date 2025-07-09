import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../testApp';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

let token: string;
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'employee@example.com',
      password: 'pass123',
      role: 'EMPLOYEE',
    });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Expense Routes', () => {
  let expenseId: string;

  it('should create an expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 500,
        category: 'Food',
        description: 'Lunch',
        date: '2025-07-06',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(500);
    expenseId = res.body._id;
  });

  it('should fetch own expenses', async () => {
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].category).toBe('Food');
  });
});
