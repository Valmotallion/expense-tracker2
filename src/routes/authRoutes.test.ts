import request from 'supertest';
import express from 'express';
import authRoutes from './authRoutes';
import { login } from '../controllers/authController';

// src/routes/authRoutes.test.ts

jest.mock('../controllers/authController', () => ({
    login: jest.fn((req, res) => res.status(200).send({ message: 'Login successful' })),
}));

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('authRoutes /login', () => {
    it('should return 400 if email is invalid', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'invalid-email', password: '1234', role: 'EMPLOYEE' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should return 400 if password is too short', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '123', role: 'EMPLOYEE' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should return 400 if role is invalid', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '1234', role: 'INVALID_ROLE' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should call login controller if inputs are valid', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '1234', role: 'EMPLOYEE' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(login).toHaveBeenCalled();
    });
});