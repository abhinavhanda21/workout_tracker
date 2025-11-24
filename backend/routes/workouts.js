import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all workouts for logged-in user
router.get('/', authenticateToken, (req, res) => {
  try {
    const workouts = db.prepare(`
      SELECT w.id, w.date, w.notes, w.created_at,
             json_group_array(
               json_object(
                 'id', e.id,
                 'exercise_name', e.exercise_name,
                 'weight', e.weight,
                 'reps', e.reps,
                 'sets', e.sets
               )
             ) as exercises
      FROM workouts w
      LEFT JOIN exercises e ON w.id = e.workout_id
      WHERE w.user_id = ?
      GROUP BY w.id
      ORDER BY w.date DESC
    `).all(req.user.id);

    const formattedWorkouts = workouts.map(w => ({
      ...w,
      exercises: JSON.parse(w.exercises).filter(e => e.id !== null)
    }));

    res.json(formattedWorkouts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new workout
router.post('/', authenticateToken, (req, res) => {
  try {
    const { date, notes, exercises } = req.body;

    if (!date || !exercises || exercises.length === 0) {
      return res.status(400).json({ error: 'Date and at least one exercise are required' });
    }

    // Insert workout
    const workoutResult = db.prepare('INSERT INTO workouts (user_id, date, notes) VALUES (?, ?, ?)').run(req.user.id, date, notes || null);

    const workoutId = workoutResult.lastInsertRowid;

    // Insert exercises
    const insertExercise = db.prepare('INSERT INTO exercises (workout_id, exercise_name, weight, reps, sets) VALUES (?, ?, ?, ?, ?)');
    
    exercises.forEach(exercise => {
      insertExercise.run(workoutId, exercise.exercise_name, exercise.weight, exercise.reps, exercise.sets);
    });

    res.status(201).json({
      message: 'Workout created successfully',
      workout_id: workoutId
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a workout
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM workouts WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
