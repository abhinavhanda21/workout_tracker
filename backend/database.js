import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'workout-tracker.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
  CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
  CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
  CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(exercise_name);
`);

console.log('Database initialized successfully');

export default db;
