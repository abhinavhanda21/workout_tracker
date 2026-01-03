import axios from 'axios';

// Use CRA env var instead of import.meta.env (Vite)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  // add common headers if needed
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const workoutAPI = {
  getAll: () => api.get('/workouts'),
  create: (data) => api.post('/workouts', data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

export const leaderboardAPI = {
  getOverall: () => api.get('/leaderboard'),
  getByExercise: (exerciseName) => api.get(`/leaderboard/${exerciseName}`),
  getExercises: () => api.get('/leaderboard/exercises/list'),
};

export default api;
