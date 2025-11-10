# Ankicode - Intelligent LeetCode Review System

> LeetCode Problem Review Management System Based on the Forgetting Curve Algorithm

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248)](https://www.mongodb.com/)

## 📚 Project Overview

Ankicode is a full-stack web application designed for LeetCode practitioners to efficiently review previously solved problems using a scientifically-based forgetting curve algorithm. The system automatically fetches problem information from the LeetCode API and intelligently schedules review sessions based on the user's confidence level.

### Core Features

- 🧠 **Intelligent Review Algorithm** - Based on Ebbinghaus Forgetting Curve, automatically adjusts review intervals according to confidence level
- 💻 **LeetCode Integration** - Automatically fetches problem information, difficulty, tags, and metadata
- 📊 **Visual Dashboard** - Real-time view of learning progress and review statistics
- 📅 **Today's Review** - Daily review checklist for efficient time management
- 🎯 **Personalized Notes** - Add solution approaches and notes for each problem
- 🔔 **Smart Reminders** - Reminder system based on review schedule

---

## 🏗️ Technical Architecture

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI Framework |
| **TypeScript** | 5.3 | Type Safety |
| **Vite** | 5.0 | Build Tool |
| **React Router** | 6.20 | Routing Management |
| **React Query** | 5.12 | Data Fetching & Caching |
| **Axios** | 1.6 | HTTP Client |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | Runtime Environment |
| **Express** | 4.18 | Web Framework |
| **TypeScript** | 5.3 | Type Safety |
| **MongoDB** | 8.0 | Database |
| **Mongoose** | 8.0 | ODM |
| **JWT** | 9.0 | Authentication |
| **Zod** | 3.22 | Data Validation |
| **Bcrypt** | 5.1 | Password Encryption |

---

## 📁 Project Structure

```
teamProj/
├── backend/                    # Backend Service
│   ├── src/
│   │   ├── models/            # Mongoose Data Models
│   │   │   ├── User.ts        # User Model
│   │   │   ├── Problem.ts     # Problem Model
│   │   │   └── Reminder.ts    # Reminder Model
│   │   ├── controllers/       # Business Logic Controllers
│   │   │   ├── authController.ts
│   │   │   ├── problemController.ts
│   │   │   ├── reminderController.ts
│   │   │   ├── dashboardController.ts
│   │   │   ├── settingsController.ts
│   │   │   └── leetcodeController.ts
│   │   ├── routes/            # API Routes
│   │   │   ├── auth.ts
│   │   │   ├── problems.ts
│   │   │   ├── reminders.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── settings.ts
│   │   │   └── leetcode.ts
│   │   ├── middleware/        # Middleware
│   │   │   ├── auth.ts        # JWT Authentication
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── services/          # Business Service Layer
│   │   │   └── leetcodeService.ts
│   │   ├── validators/        # Zod Validation Schemas
│   │   │   ├── auth.ts
│   │   │   └── problem.ts
│   │   ├── utils/             # Utility Functions
│   │   │   └── responseWrapper.ts
│   │   └── index.ts           # Application Entry Point
│   ├── .env                   # Environment Variables
│   └── package.json
│
├── frontend/                   # Frontend Application
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   ├── Layout/
│   │   │   │   ├── MainLayout.tsx    # Main Layout
│   │   │   │   └── Sidebar.tsx       # Sidebar
│   │   │   └── AddLeetCodeProblem.tsx # Add Problem Component
│   │   ├── pages/             # Page Components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Problems.tsx
│   │   │   ├── ProblemDetail.tsx
│   │   │   ├── TodayReview.tsx
│   │   │   ├── Reminders.tsx
│   │   │   └── Settings.tsx
│   │   ├── api/               # API Client
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── problems.ts
│   │   │   ├── reminders.ts
│   │   │   └── dashboard.ts
│   │   ├── contexts/          # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── types/             # TypeScript Types
│   │   │   └── index.ts
│   │   ├── styles/            # Global Styles
│   │   │   ├── theme.css      # Theme Variables
│   │   │   └── global.css     # Global Styles
│   │   ├── App.tsx            # App Root Component
│   │   └── main.tsx           # Application Entry Point
│   └── package.json
│
└── database_scripts/           # Database Scripts
    ├── seed-leetcode.ts       # Seed Data
    └── wipe.ts                # Wipe Database
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **MongoDB Atlas** account (or local MongoDB)
- **Terminal** access

### 1. Clone the Project

```bash
cd /path/to/your/workspace
```

### 2. Configure Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOF

# Install dependencies
npm install

# Start backend dev server
npm run dev
```

Backend will run at `http://localhost:3000`

### 3. Configure Frontend

```bash
cd ../frontend

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000
EOF

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend will run at `http://localhost:5173`

### 4. Initialize Database (Optional)

```bash
cd ../database_scripts

# Install dependencies
npm install

# Run seed script (create demo data)
npx tsx seed-leetcode.ts
```

**Demo Account:**
- Email: `demo@example.com`
- Password: `password123`

---

## 📊 Data Models

### User

```typescript
interface IUser {
  name: string;                    // Username
  email: string;                   // Email (unique)
  password: string;                // Encrypted password
  leetcodeUsername?: string;       // LeetCode username (optional)
  problemIds: ObjectId[];          // Associated problem IDs
  settings: {
    notifications: {
      optIn: boolean;              // Enable notifications
    };
    skipWeekends?: boolean;        // Skip weekends
  };
}
```

### Problem

```typescript
interface IProblem {
  leetcodeId: number;              // LeetCode problem number
  titleSlug: string;               // Problem slug
  name: string;                    // Problem name
  difficulty: string;              // Difficulty: Easy/Medium/Hard
  deadline: Date;                  // Deadline
  notes: string;                   // User notes
  tags: string[];                  // Tags (array, strings, etc.)
  status: 'todo' | 'in_progress' | 'done';  // Status
  lastPracticedAt?: Date;          // Last practice time
  confidenceHistory: Array<{      // Confidence level history
    date: Date;
    level: 'hard' | 'medium' | 'easy';
  }>;
  ownerId: ObjectId;               // Owner user ID
}

// Unique index: same user cannot add same problem number twice
Index: { ownerId: 1, leetcodeId: 1 } unique
```

### Reminder

```typescript
interface IReminder {
  problemId: ObjectId;             // Associated problem ID
  userId: ObjectId;                // Associated user ID
  scheduledFor: Date;              // Scheduled reminder time
  status: 'pending' | 'sent' | 'snoozed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Documentation

### Unified Response Format

All API responses follow this format:

```typescript
{
  message: string;        // Operation result message
  data: T | null;         // Response data (success) or null (failure)
}
```

### Authentication API `/api/auth`

| Method | Path | Description | Request Body |
|--------|------|-------------|--------------|
| POST | `/register` | User registration | `{ name, email, password }` |
| POST | `/login` | User login | `{ email, password }` |
| POST | `/logout` | Logout | None |
| GET | `/me` | Get current user | None (requires JWT) |

**Authentication Method:** Bearer Token

```bash
Authorization: Bearer <jwt_token>
```

### Problems API `/api/problems`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | Get problem list (supports query, sort, pagination) | Required |
| GET | `/:id` | Get single problem details | Required |
| POST | `/` | Create new problem | Required |
| PUT | `/:id` | Update problem | Required |
| DELETE | `/:id` | Delete problem | Required |

**Query Parameters Example:**

```
GET /api/problems?status=todo&sort=-createdAt&page=1&limit=10
```

**Create Problem Example:**

```json
POST /api/problems
{
  "leetcodeId": 1,
  "deadline": "2025-11-12T00:00:00.000Z",
  "notes": "Two Sum - Classic hash table problem"
}
```

### LeetCode API `/api/leetcode`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/search?questionId=1` | Search LeetCode problem | Required |

### Dashboard API `/api/dashboard`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/today` | Get today's review problems | Required |
| POST | `/mark-done` | Mark practice complete | Required |

**Mark Complete Example:**

```json
POST /api/dashboard/mark-done
{
  "problemId": "507f1f77bcf86cd799439011",
  "confidenceLevel": "easy",
  "timeSpent": 15
}
```

### Reminders API `/api/reminders`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | Get reminder list | Required |
| POST | `/` | Create reminder | Required |
| PUT | `/:id` | Update reminder | Required |
| DELETE | `/:id` | Delete reminder | Required |

### Settings API `/api/settings`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | Get user settings | Required |
| PUT | `/notifications` | Update notification settings | Required |
| PUT | `/leetcode-username` | Set LeetCode username | Required |
| GET | `/leetcode-stats` | Get LeetCode stats | Required |

---

## 🧠 Forgetting Curve Algorithm

The system automatically calculates the next review time based on user-marked "confidence level":

```typescript
// Review interval rules
const INTERVALS = {
  hard: 1,      // Unfamiliar: review in 1 day
  medium: 3,    // Average: review in 3 days
  easy: 7       // Proficient: review in 7 days
};

// If marked as "easy" multiple times consecutively, interval gradually extends
// 1st easy: 7 days
// 2nd easy: 14 days
// 3rd easy: 30 days
```

**Core Logic in:** `backend/src/controllers/dashboardController.ts` `markPracticeDone` function

---

## 🎨 Frontend Architecture

### Route Structure

```typescript
// src/App.tsx
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected Routes */}
  <Route element={<PrivateRoute />}>
    <Route element={<MainLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/today" element={<TodayReview />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/:id" element={<ProblemDetail />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Route>
</Routes>
```

### State Management

- **Auth State**: `AuthContext` + `localStorage`
- **Server State**: `React Query` (caching, auto-refetch)
- **Form State**: `useState` (local state)

### Theme System

Global CSS variables defined in `src/styles/theme.css`:

```css
:root {
  --brand-primary: #FFA116;    /* Primary: Orange */
  --brand-secondary: #2CBB5D;  /* Secondary: Green */
  --brand-danger: #EF4743;     /* Danger: Red */
  --brand-info: #00A8E1;       /* Info: Blue */
  /* ... more variables */
}
```

---

## 🛠️ Development Guide

### Adding New API Endpoints

1. **Define Route** (`backend/src/routes/`)
2. **Create Controller** (`backend/src/controllers/`)
3. **Add Validation** (`backend/src/validators/`)
4. **Update Frontend API Client** (`frontend/src/api/`)
5. **Create/Update Frontend Components**

### Adding New Pages

1. **Create Page Component** (`frontend/src/pages/`)
2. **Add Route** (`frontend/src/App.tsx`)
3. **Create Corresponding CSS** (use theme variables)
4. **Update Sidebar Navigation** (`frontend/src/components/Layout/Sidebar.tsx`)

### Data Validation Flow

```
User Input → Frontend Validation → API Request → Zod Validation → Controller Processing → Database
```

### Error Handling

All errors are handled uniformly through the `AppError` class:

```typescript
// backend/src/middleware/errorHandler.ts
throw new AppError('Error message', 400);  // Throw error
```

---

## 🧪 Testing

### Testing Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Get problem list (requires token)
curl http://localhost:3000/api/problems \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Seed Data

```bash
cd database_scripts
npx tsx seed-leetcode.ts
```

Creates:
- 1 demo user
- 14 LeetCode problems
- Corresponding review reminders

---

## 🐛 Common Issues

### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 2. MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect to server`

**Check:**
- ✅ Is MongoDB URI correct?
- ✅ Does IP whitelist include `0.0.0.0/0` (dev environment)?
- ✅ Are username and password correct?
- ✅ Is network connection normal?

### 3. CORS Error

**Error:** `Access to fetch at ... from origin ... has been blocked by CORS policy`

**Solution:**
- Ensure backend CORS config allows frontend domain
- Check CORS settings in `backend/src/index.ts`

### 4. JWT Token Expired

**Error:** `401 Unauthorized`

**Solution:**
- Re-login to get new token
- Check if token is correctly stored in `localStorage`

---

## 📝 Todo / Feature Roadmap

- [ ] Support multiple review algorithms (SM-2, Leitner)
- [ ] Problem tag filtering and search optimization
- [ ] Data export functionality (CSV, JSON)
- [ ] Problem completion statistics charts
- [ ] Mobile responsive optimization
- [ ] Dark mode support
- [ ] Email reminder functionality
- [ ] Problem discussion area integration

---

## 🤝 Contributing Guide

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- Use TypeScript strict mode
- Follow ESLint configuration
- Components use functional approach
- CSS uses theme variables
- API naming follows RESTful conventions

---

## 📄 License

This project is for educational purposes only.

---

## 👥 Authors

CS409 Team Project - UIUC

---

## 🔗 Related Links

- [LeetCode](https://leetcode.com/)
- [Alfa LeetCode API](https://github.com/alfaarghya/alfa-leetcode-api)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

---

## 💡 Tips

### Using Cursor AI for Development

After opening the project in Cursor, you can:

1. **Ask Architecture Questions**:
   - "How is this project organized?"
   - "How does the authentication flow work?"

2. **Request Code Explanations**:
   - Select code → Cmd+L → "Explain what this code does"

3. **Generate New Features**:
   - "Add a chart showing weekly review statistics"
   - "Create a function to export all problems as CSV"

4. **Debug Issues**:
   - "Why is this API returning a 500 error?"
   - "How do I fix this TypeScript type error?"

### Quick Navigation

| Want to... | Check File |
|------------|-----------|
| Modify data models | `backend/src/models/` |
| Add API endpoints | `backend/src/routes/` + `controllers/` |
| Modify page UI | `frontend/src/pages/` |
| Adjust style theme | `frontend/src/styles/theme.css` |
| Change algorithm logic | `backend/src/controllers/dashboardController.ts` |

---

**🎉 Happy coding! Feel free to open an issue if you have any questions!**
