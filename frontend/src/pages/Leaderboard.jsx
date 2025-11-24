import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../api';

function Leaderboard() {
  const [view, setView] = useState('overall');
  const [leaderboard, setLeaderboard] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
    fetchOverallLeaderboard();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await leaderboardAPI.getExercises();
      setExercises(response.data);
    } catch (err) {
      console.error('Failed to load exercises');
    }
  };

  const fetchOverallLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await leaderboardAPI.getOverall();
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseLeaderboard = async (exerciseName) => {
    setLoading(true);
    try {
      const response = await leaderboardAPI.getByExercise(exerciseName);
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'overall') {
      fetchOverallLeaderboard();
    }
  };

  const handleExerciseChange = (exerciseName) => {
    setSelectedExercise(exerciseName);
    if (exerciseName) {
      fetchExerciseLeaderboard(exerciseName);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">🏆 Champions Leaderboard</h1>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleViewChange('overall')}
            className={`px-4 py-2 rounded ${view === 'overall' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Overall Rankings
          </button>
          <button
            onClick={() => handleViewChange('exercise')}
            className={`px-4 py-2 rounded ${view === 'exercise' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            By Exercise
          </button>
        </div>

        {view === 'exercise' && (
          <select
            value={selectedExercise}
            onChange={(e) => handleExerciseChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an exercise</option>
            {exercises.map((ex) => (
              <option key={ex.exercise_name} value={ex.exercise_name}>
                {ex.exercise_name} ({ex.count} entries)
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                {view === 'overall' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Volume (lbs)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workouts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercises</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Weight (lbs)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Reps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Volume</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {view === 'exercise' && !selectedExercise ? 'Select an exercise to view rankings' : 'No data available'}
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr key={entry.user_id} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{entry.username}</td>
                    {view === 'overall' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.total_volume?.toLocaleString() || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.total_workouts || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.total_exercises || 0}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.max_weight}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.max_reps}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.max_volume}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
