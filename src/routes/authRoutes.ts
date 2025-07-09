import express from 'express';
import { login, loginUser, registerUser } from '../controllers/authController';
import { body } from 'express-validator';
import { validate } from '../validators/validate';
import { registerValidator, loginValidator } from '../validators/authValidators';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();
router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
    body('role').isIn(['EMPLOYEE', 'ADMIN']),
  ],
  validate,
  login
);

export default router;
