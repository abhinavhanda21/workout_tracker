import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get leaderboard for a specific exercise
router.get('/:exerciseName', (req, res) => {
  try {
    const { exerciseName } = req.params;

    const leaderboard = db.prepare(`
      SELECT 
        u.username,
        u.id as user_id,
        MAX(e.weight) as max_weight,
        MAX(e.reps) as max_reps,
        MAX(e.weight * e.reps) as max_volume
      FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      JOIN users u ON w.user_id = u.id
      WHERE LOWER(e.exercise_name) = LOWER(?)
      GROUP BY u.id, u.username
      ORDER BY max_weight DESC, max_volume DESC
      LIMIT 100
    `).all(exerciseName);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get overall leaderboard (total volume across all exercises)
router.get('/', (req, res) => {
  try {
    const leaderboard = db.prepare(`
      SELECT 
        u.username,
        u.id as user_id,
        COUNT(DISTINCT w.id) as total_workouts,
        SUM(e.weight * e.reps * e.sets) as total_volume,
        COUNT(e.id) as total_exercises
      FROM users u
      LEFT JOIN workouts w ON u.id = w.user_id
      LEFT JOIN exercises e ON w.id = e.workout_id
      GROUP BY u.id, u.username
      ORDER BY total_volume DESC
      LIMIT 100
    `).all();

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get list of all unique exercises
router.get('/exercises/list', (req, res) => {
  try {
    const exercises = db.prepare(`
      SELECT DISTINCT exercise_name, COUNT(*) as count
      FROM exercises
      GROUP BY exercise_name
      ORDER BY count DESC
    `).all();

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
