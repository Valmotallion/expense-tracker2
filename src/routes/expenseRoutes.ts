import express from 'express';
import {
  createExpense,
  getExpenses,
  approveExpense,
  getAnalytics,
  deleteExpense,
} from '../controllers/expenseController';
import { authenticate, authorize } from '../middlewares/auth';
import { body } from 'express-validator';
import { validate } from '../validators/validate';

const router = express.Router();

router.use(authenticate);

router.get('/', getExpenses);
router.post(
  '/',
  [
    body('amount').isNumeric(),
    body('category').notEmpty(),
    body('date').isISO8601(),
  ],
  validate,
  createExpense
);

router.patch('/:id/approve', authorize(['ADMIN']), approveExpense);
router.get('/analytics', authorize(['ADMIN']), getAnalytics);
router.delete('/:id', authorize(['EMPLOYEE']), deleteExpense);
// routes/expenseRoutes.ts
// router.delete('/:id', authorize(['EMPLOYEE']), deleteExpense);

export default router;
