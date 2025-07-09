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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const testApp_1 = __importDefault(require("../testApp"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.test' });
let token;
let mongo;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongo = yield mongodb_memory_server_1.MongoMemoryServer.create();
    yield mongoose_1.default.connect(mongo.getUri());
    const res = yield (0, supertest_1.default)(testApp_1.default)
        .post('/api/auth/login')
        .send({
        email: 'employee@example.com',
        password: 'pass123',
        role: 'EMPLOYEE',
    });
    token = res.body.token;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    yield mongo.stop();
}));
describe('Expense Routes', () => {
    let expenseId;
    it('should create an expense', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(testApp_1.default)
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
    }));
    it('should fetch own expenses', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(testApp_1.default)
            .get('/api/expenses')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].category).toBe('Food');
    }));
});
