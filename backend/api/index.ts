import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from '../src/routes/auth.routes';
import transactionRoutes from '../src/routes/transaction.routes';
import utilityRoutes from '../src/routes/utility.routes';
import reportRoutes from '../src/routes/report.routes';
import userRoutes from '../src/routes/user.routes';
import targetRoutes from '../src/routes/target.routes';
import receiptRoutes from '../src/routes/receipt.routes';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/utility', utilityRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/receipts', receiptRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
