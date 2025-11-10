# 🚀 Ankicode Quick Start Guide

## 📋 Prerequisites

- ✅ Node.js 20+ installed
- ✅ npm installed
- ✅ MongoDB Atlas configured (in backend/.env)

## ⚡ Quick Start (One-Click Run)

### Method 1: Auto Start Script (Recommended)

```bash
cd /Users/shuwei/UiucProjects/cs409/teamProj

# One-click start backend and frontend
./start.sh
```

### Method 2: Manual Start

#### 1. Start Backend

```bash
# Open Terminal 1
cd /Users/shuwei/UiucProjects/cs409/teamProj/backend
npm run dev
```

Backend will run at: `http://localhost:3000`

#### 2. Start Frontend

```bash
# Open Terminal 2
cd /Users/shuwei/UiucProjects/cs409/teamProj/frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

## 🌐 Access Application

Open browser and visit: **http://localhost:5173**

## 👤 Demo Account

- **Email**: `demo@example.com`
- **Password**: `password123`

## 📊 API Endpoints

- **Health Check**: http://localhost:3000/api/health
- **API Documentation**: See `api-spec.yaml`

## 🛑 Stop Services

```bash
# Stop backend
pkill -f "tsx watch"

# Stop frontend
pkill -f "vite"

# Or press Ctrl+C in the running terminal
```

## 📝 View Logs

```bash
# Backend logs
tail -f /tmp/ankicode-backend.log

# Frontend logs
tail -f /tmp/ankicode-frontend.log
```

## 🔧 Common Issues

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Check process occupying the port
lsof -ti:3000
lsof -ti:5173

# Kill process
kill -9 $(lsof -ti:3000)
kill -9 $(lsof -ti:5173)
```

### MongoDB Connection Failed

Check if `MONGODB_URI` in `backend/.env` is correctly configured.

### Frontend Cannot Connect to Backend

Make sure:
1. Backend is running (visit http://localhost:3000/api/health)
2. `VITE_API_URL=http://localhost:3000` in `frontend/.env` is correct

## 🗄️ Initialize Database (Optional)

If you need seed data:

```bash
cd /Users/shuwei/UiucProjects/cs409/teamProj/database_scripts
npm install
npx tsx seed-leetcode.ts
```

This will create:
- 1 demo user (demo@example.com)
- 14 LeetCode problem examples
- Corresponding review reminders

## 📚 More Information

For detailed documentation, see [README.md](./README.md)

---

**💡 Tip**: First run requires executing `npm install`, after that you can run directly.
