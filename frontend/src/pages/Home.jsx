import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to Workout Tracker</h1>
      <p className="mb-6">
        Please <Link to="/login" className="text-blue-600">log in</Link> or <Link to="/register" className="text-blue-600">register</Link> to continue.
      </p>
    </div>
  );
}