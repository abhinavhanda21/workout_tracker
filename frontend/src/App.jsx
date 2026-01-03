import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddWorkout from './pages/AddWorkout';
import Leaderboard from './pages/Leaderboard';
import Home from './pages/Home';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const fetchWorkouts = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('workouts:', response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchWorkouts();
  }, [user, fetchWorkouts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // temporary debug banner
  console.log('App render user:', user);

  return (
    <Router>
      <div style={{ border: '2px solid #f00', padding: 6, margin: 6 }}>
        Debug: app mounted — user={user ? 'yes' : 'no'}
      </div>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Home />} />
        <Route path="/add-workout" element={user ? <AddWorkout /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

