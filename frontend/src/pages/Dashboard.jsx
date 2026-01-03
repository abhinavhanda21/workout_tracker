import { useState, useEffect } from 'react';
import { workoutAPI } from '../api';

function Dashboard({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API base: read from REACT_APP_API_URL at build time, fallback to your Render URL
  const API_BASE = process.env.REACT_APP_API_URL || 'https://workout-tracker-hk00.onrender.com';

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/workouts`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    // optimistic update + backend request
    const prev = workouts;
    setWorkouts(workouts.filter(w => w.id !== id));
    try {
      const res = await fetch(`${API_BASE}/api/workouts/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setWorkouts(prev);
        throw new Error('Delete failed');
      }
    } catch (err) {
      alert('Failed to delete workout');
      setWorkouts(prev);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Workouts</h1>
        <p className="text-gray-600">Track your progress and view your workout history</p>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {workouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No workouts yet. Start tracking your fitness journey!</p>
          <a href="/add-workout" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Add Your First Workout
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{new Date(workout.date).toLocaleDateString()}</h3>
                  {workout.notes && <p className="text-gray-600 text-sm mt-1">{workout.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(workout.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-2">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{exercise.exercise_name}</span>
                      <span className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight} lbs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
