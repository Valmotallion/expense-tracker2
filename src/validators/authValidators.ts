import { body } from 'express-validator';

// Validation for /api/auth/register
export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['EMPLOYEE', 'ADMIN'])
    .withMessage('Role must be EMPLOYEE or ADMIN')
];

// Validation for /api/auth/login
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
  // 🔒 No role field in login — it's derived from DB
];
