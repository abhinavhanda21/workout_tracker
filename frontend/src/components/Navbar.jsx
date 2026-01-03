import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <div>
        <Link to="/" className="font-bold">Workout Tracker</Link>
      </div>
      <div className="space-x-4">
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <Link to="/add-workout">Add Workout</Link>
            <button onClick={onLogout} className="ml-2 text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}