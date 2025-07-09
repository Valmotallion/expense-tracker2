"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
// Validation for /api/auth/register
exports.registerValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('role')
        .isIn(['EMPLOYEE', 'ADMIN'])
        .withMessage('Role must be EMPLOYEE or ADMIN')
];
// Validation for /api/auth/login
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
    // 🔒 No role field in login — it's derived from DB
];
