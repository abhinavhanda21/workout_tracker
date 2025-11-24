import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';
import leaderboardRoutes from './routes/leaderboard.js';
import './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
