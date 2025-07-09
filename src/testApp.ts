import express from 'express';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { authenticate } from './middlewares/auth';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use(errorHandler);

export default app;
