import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.use(errorHandler);

export default app;
