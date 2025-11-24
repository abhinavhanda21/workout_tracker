import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI } from '../api';

function AddWorkout() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    { exercise_name: '', weight: '', reps: '', sets: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addExercise = () => {
    setExercises([...exercises, { exercise_name: '', weight: '', reps: '', sets: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validExercises = exercises.filter(ex => 
      ex.exercise_name && ex.weight && ex.reps && ex.sets
    );

    if (validExercises.length === 0) {
      setError('Please add at least one complete exercise');
      setLoading(false);
      return;
    }

    try {
      await workoutAPI.create({
        date,
        notes,
        exercises: validExercises.map(ex => ({
          ...ex,
          weight: parseFloat(ex.weight),
          reps: parseInt(ex.reps),
          sets: parseInt(ex.sets)
        }))
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Add New Workout</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="How did the workout feel?"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-bold">Exercises</label>
            <button
              type="button"
              onClick={addExercise}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              + Add Exercise
            </button>
          </div>

          {exercises.map((exercise, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Exercise {index + 1}</span>
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Exercise name (e.g., Bench Press)"
                  value={exercise.exercise_name}
                  onChange={(e) => updateExercise(index, 'exercise_name', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Weight (lbs)"
                  value={exercise.weight}
                  onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.5"
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Workout'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddWorkout;
