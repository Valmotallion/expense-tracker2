"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const auth_1 = require("../middlewares/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../validators/validate");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/', expenseController_1.getExpenses);
router.post('/', [
    (0, express_validator_1.body)('amount').isNumeric(),
    (0, express_validator_1.body)('category').notEmpty(),
    (0, express_validator_1.body)('date').isISO8601(),
], validate_1.validate, expenseController_1.createExpense);
router.patch('/:id/approve', (0, auth_1.authorize)(['ADMIN']), expenseController_1.approveExpense);
router.get('/analytics', (0, auth_1.authorize)(['ADMIN']), expenseController_1.getAnalytics);
router.delete('/:id', (0, auth_1.authorize)(['EMPLOYEE']), expenseController_1.deleteExpense);
// routes/expenseRoutes.ts
// router.delete('/:id', authorize(['EMPLOYEE']), deleteExpense);
exports.default = router;
