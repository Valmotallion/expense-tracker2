"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const authController_1 = require("../controllers/authController");
// src/routes/authRoutes.test.ts
jest.mock('../controllers/authController', () => ({
    login: jest.fn((req, res) => res.status(200).send({ message: 'Login successful' })),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
describe('authRoutes /login', () => {
    it('should return 400 if email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({ email: 'invalid-email', password: '1234', role: 'EMPLOYEE' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    }));
    it('should return 400 if password is too short', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '123', role: 'EMPLOYEE' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    }));
    it('should return 400 if role is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '1234', role: 'INVALID_ROLE' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    }));
    it('should call login controller if inputs are valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '1234', role: 'EMPLOYEE' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(authController_1.login).toHaveBeenCalled();
    }));
});
