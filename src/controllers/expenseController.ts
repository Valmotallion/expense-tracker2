import { Request, Response } from 'express';
import Expense from '../models/Expense';

export const createExpense = async (req: any, res: Response) => {
  const { amount, category, description, date } = req.body;
  const newExpense = new Expense({
    userId: req.user.userId,
    amount,
    category,
    description,
    date,
  });

  await newExpense.save();
  res.status(201).json(newExpense);
};

export const getExpenses = async (req: any, res: Response) => {
  const { role, userId } = req.user;
  const filter = role === 'ADMIN' ? {} : { userId };
  const expenses = await Expense.find(filter).populate('userId', 'email');
  res.json(expenses);
};

export const approveExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ['APPROVED', 'REJECTED'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updated = await Expense.findByIdAndUpdate(id, { status }, { new: true });
  res.json(updated);
};

export const getAnalytics = async (req: Request, res: Response) => {
  const data = await Expense.aggregate([
    { $match: { status: 'APPROVED' } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);

  res.json(data);
};

// export const deleteExpense = async (req: any, res: Response) => {
//   const { id } = req.params;
//   if (req.user.role !== 'EMPLOYEE') {
//     return res.status(403).json({ message: 'Access denied' });
//   }

//   const deleted = await Expense.findByIdAndDelete(id);
//   if (!deleted) {
//     return res.status(404).json({ message: 'Expense not found' });
//   }

//   res.json({ message: 'Expense deleted successfully' });
// }


export const deleteExpense = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // ONLY FOR TESTING – removes any expense by ID (bypasses role/ownership checks)
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    return res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

