# 🚀 Quick Setup Guide

## Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Git

## Setup Steps

### 1. Clone & Install

```bash
git clone <repository-url>
cd AnkiCode
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and update these values:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: A random secret key
nano .env
```

### 3. Start Development

```bash
# Start both frontend and backend
npm run dev
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173

### 4. Seed Database (Optional)

```bash
npm run seed
```

**Demo Account:**
- Email: `demo@example.com`
- Password: `password123`

## Available Scripts

```bash
npm run dev              # Start frontend + backend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run seed             # Seed database with demo data
npm run wipe             # Wipe database (⚠️ Warning: deletes all data)
```

## Environment Variables

All configuration is in the root `.env` file:

```bash
# Database
MONGODB_URI=mongodb+srv://...

# Backend
PORT=3001
JWT_SECRET=your-secret-key
FRONTEND_ORIGIN=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3001
```

## Troubleshooting

### Backend won't start
- Check MONGODB_URI is correct
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify PORT 3001 is not in use

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check VITE_API_URL in .env matches backend PORT

### Login fails
- Run `npm run seed` to create demo account
- Check database connection is working
