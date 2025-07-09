"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const validate_1 = require("../validators/validate");
const authValidators_1 = require("../validators/authValidators");
const validateRequest_1 = require("../middlewares/validateRequest");
const router = express_1.default.Router();
router.post('/register', authValidators_1.registerValidator, validateRequest_1.validateRequest, authController_1.registerUser);
router.post('/login', authValidators_1.loginValidator, validateRequest_1.validateRequest, authController_1.loginUser);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 4 }),
    (0, express_validator_1.body)('role').isIn(['EMPLOYEE', 'ADMIN']),
], validate_1.validate, authController_1.login);
exports.default = router;
