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
exports.loginUser = exports.registerUser = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    let user = yield User_1.default.findOne({ email });
    if (!user) {
        const hashed = yield bcryptjs_1.default.hash(password, 10);
        user = new User_1.default({ email, password: hashed, role });
        yield user.save();
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: 'Invalid credentials' });
    const token = (0, generateToken_1.generateToken)({ userId: user._id, role: user.role });
    res.json({ token });
});
exports.login = login;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({
            email,
            password: hashedPassword,
            role,
        });
        const token = (0, generateToken_1.generateToken)({ userId: user._id, role: user.role });
        res.status(201).json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = (0, generateToken_1.generateToken)({ userId: user._id, role: user.role });
        res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.loginUser = loginUser;
