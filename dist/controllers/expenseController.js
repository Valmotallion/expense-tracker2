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
exports.deleteExpense = exports.getAnalytics = exports.approveExpense = exports.getExpenses = exports.createExpense = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, category, description, date } = req.body;
    const newExpense = new Expense_1.default({
        userId: req.user.userId,
        amount,
        category,
        description,
        date,
    });
    yield newExpense.save();
    res.status(201).json(newExpense);
});
exports.createExpense = createExpense;
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, userId } = req.user;
    const filter = role === 'ADMIN' ? {} : { userId };
    const expenses = yield Expense_1.default.find(filter).populate('userId', 'email');
    res.json(expenses);
});
exports.getExpenses = getExpenses;
const approveExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const validStatus = ['APPROVED', 'REJECTED'];
    if (!validStatus.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = yield Expense_1.default.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
});
exports.approveExpense = approveExpense;
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Expense_1.default.aggregate([
        { $match: { status: 'APPROVED' } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);
    res.json(data);
});
exports.getAnalytics = getAnalytics;
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
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // ONLY FOR TESTING – removes any expense by ID (bypasses role/ownership checks)
        const deleted = yield Expense_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        return res.json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteExpense = deleteExpense;
