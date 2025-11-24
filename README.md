# Workout Tracker - Full Stack Web Application

A complete workout tracking application where users can log their exercises, track progress, and compete on leaderboards.

## 🚀 Tech Stack

### Frontend
- React 18
- Vite (build tool)
- React Router (navigation)
- Tailwind CSS (styling)
- Axios (HTTP client)

### Backend
- Node.js
- Express
- SQLite (better-sqlite3)
- JWT Authentication
- bcryptjs (password hashing)

## 📋 Features

- **User Authentication**: Register and login with JWT tokens
- **Workout Logging**: Track exercises with weight, reps, and sets
- **Workout History**: View all your past workouts
- **Leaderboards**: 
  - Overall rankings by total volume
  - Exercise-specific rankings
  - Top 3 highlighted with medals 🥇🥈🥉
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Create environment file:
```powershell
Copy-Item .env.example .env
```

4. Edit `.env` and update the JWT_SECRET:
```
PORT=5000
JWT_SECRET=your-secure-secret-key-here
NODE_ENV=development
```

5. Start the backend server:
```powershell
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm run dev
```

The frontend will run on http://localhost:3000

## 🎯 Usage

1. **Register**: Create a new account at http://localhost:3000/register
2. **Login**: Sign in with your credentials
3. **Add Workout**: Click "Add Workout" to log a new session
   - Select date
   - Add exercises with weight, reps, and sets
   - Add optional notes
4. **View Dashboard**: See all your workout history
5. **Check Leaderboard**: Compare your progress with other users

## 📁 Project Structure

```
workout-tracker/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── workouts.js      # Workout CRUD operations
│   │   └── leaderboard.js   # Leaderboard rankings
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── database.js          # SQLite setup
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddWorkout.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── App.jsx
│   │   ├── api.js           # API client
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🔒 Database Schema

### Users Table
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password (hashed)
- created_at

### Workouts Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- date
- notes
- created_at

### Exercises Table
- id (PRIMARY KEY)
- workout_id (FOREIGN KEY)
- exercise_name
- weight
- reps
- sets

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Workouts (Protected)
- `GET /api/workouts` - Get all user workouts
- `POST /api/workouts` - Create new workout
- `DELETE /api/workouts/:id` - Delete workout

### Leaderboard (Public)
- `GET /api/leaderboard` - Overall rankings
- `GET /api/leaderboard/:exerciseName` - Exercise-specific rankings
- `GET /api/leaderboard/exercises/list` - List all exercises

## 🔧 Development Scripts

### Backend
```powershell
npm start       # Start production server
npm run dev     # Start with nodemon (auto-reload)
```

### Frontend
```powershell
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 📝 Future Enhancements

- Add exercise categories (strength, cardio, etc.)
- Personal records tracking
- Progress charts and analytics
- Social features (follow users, comments)
- Workout templates
- Mobile app (React Native)
- Export workout data
- Profile customization

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📄 License

ISC License - feel free to use this project for learning and development.

---

**Happy Training! 💪**
