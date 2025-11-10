# AnkiCode

A spaced repetition system for LeetCode problems based on the Ebbinghaus forgetting curve.

## Overview

AnkiCode helps you efficiently review LeetCode problems by automatically scheduling reviews based on your confidence level. The system uses a scientifically-proven spaced repetition algorithm to optimize learning retention.

### Key Features

- Intelligent review scheduling using the forgetting curve algorithm
- LeetCode problem integration and metadata fetching
- Personalized study dashboard with progress tracking
- Daily review queue management
- Confidence-based review intervals
- Problem notes and solution tracking

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, React Query, React Router  
**Backend:** Node.js, Express, TypeScript, MongoDB, JWT Authentication  
**Other:** Mongoose ODM, Bcrypt, Zod validation

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account

### Installation

```bash
# Clone repository
git clone <repository-url>
cd AnkiCode

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed database (optional)
npm run seed

# Start development servers
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Demo Account

Email: `demo@example.com`  
Password: `password123`

## Project Structure

```
AnkiCode/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & error handling
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page views
│   │   ├── api/            # API client
│   │   ├── contexts/       # React contexts
│   │   └── hooks/          # Custom hooks
│   └── package.json
│
└── database_scripts/       # Database utilities
```

## Available Scripts

```bash
npm run dev              # Start frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run seed             # Seed database with demo data
npm run wipe             # Clear database
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - List problems with filters
- `POST /api/problems` - Create new problem
- `GET /api/problems/:id` - Get problem details
- `PUT /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Delete problem
- `POST /api/problems/:id/practice` - Record practice session

### Dashboard
- `GET /api/dashboard/today` - Get today's review queue
- `GET /api/dashboard/stats` - Get user statistics

### LeetCode Integration
- `GET /api/leetcode/problem/:id` - Fetch problem from LeetCode

## Environment Variables

See `.env.example` for required configuration:

```bash
MONGODB_URI=<your-mongodb-connection-string>
PORT=3001
JWT_SECRET=<your-jwt-secret>
VITE_API_URL=http://localhost:3001
```

## Database Schema

### User
```typescript
{
  name: string
  email: string
  passwordHash: string
  leetcodeUsername?: string
  problemIds: ObjectId[]
  settings: {
    notifications: { optIn: boolean }
    skipWeekends: boolean
  }
}
```

### Problem
```typescript
{
  name: string
  leetcodeId?: number
  difficulty?: string
  deadline: Date
  rating: number
  notes: string
  tags: string[]
  status: 'todo' | 'in_progress' | 'done'
  lastPracticedAt?: Date
  confidenceHistory: Array<{
    date: Date
    level: 'hard' | 'medium' | 'easy'
  }>
  ownerId: ObjectId
}
```

### Reminder
```typescript
{
  problemId: ObjectId
  userId: ObjectId
  scheduledFor: Date
  status: 'pending' | 'completed' | 'skipped'
  createdFrom: 'practice' | 'manual'
  meta: {
    confidence?: string
    durationSec?: number
  }
}
```

## Forgetting Curve Algorithm

The review intervals are calculated based on confidence level:

- **Easy:** Review in 7 days
- **Medium:** Review in 3 days
- **Hard:** Review in 1 day

Additional reviews can be scheduled manually or triggered automatically after practice sessions.

**TODO:** More advanced forgetting curve algorithms will be implemented in the future.

## License

MIT
