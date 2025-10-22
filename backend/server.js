import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

import taskRouter from './routes/taskRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
// IMPORTANT: ensure connectDB reads from process.env.MONGO_URI
connectDB();

// Routes
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);

// health route
app.get('/', (req, res) => {
    res.send('API Working');
});

// DO NOT use app.listen() on Vercel
// Export the app for Vercel serverless runtime
export default app;