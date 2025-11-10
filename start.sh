#!/bin/bash

# Ankicode 一键启动脚本

echo "🚀 Ankicode 启动脚本"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 项目根目录
PROJECT_ROOT="/Users/shuwei/UiucProjects/cs409/teamProj"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 20+"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo ""

# 检查依赖
echo "📦 检查依赖..."
if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo "   安装后端依赖..."
    cd "$PROJECT_ROOT/backend" && npm install
fi

if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo "   安装前端依赖..."
    cd "$PROJECT_ROOT/frontend" && npm install
fi

echo "✅ 依赖已就绪"
echo ""

# 停止已有服务
echo "🛑 停止旧服务..."
pkill -f "tsx watch" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# 启动后端
echo "🔧 启动后端服务..."
cd "$PROJECT_ROOT/backend"
npm run dev > /tmp/ankicode-backend.log 2>&1 &
BACKEND_PID=$!
echo "   后端 PID: $BACKEND_PID"

# 等待后端启动
sleep 5

# 启动前端
echo "🎨 启动前端服务..."
cd "$PROJECT_ROOT/frontend"
npm run dev > /tmp/ankicode-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   前端 PID: $FRONTEND_PID"

# 等待前端启动
sleep 5

echo ""
echo "🎉 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Ankicode 已启动！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 访问地址:"
echo "   前端: http://localhost:5173"
echo "   后端: http://localhost:3000"
echo ""
echo "👤 演示账号:"
echo "   邮箱: demo@example.com"
echo "   密码: password123"
echo ""
echo "📝 查看日志:"
echo "   后端: tail -f /tmp/ankicode-backend.log"
echo "   前端: tail -f /tmp/ankicode-frontend.log"
echo ""
echo "🛑 停止服务:"
echo "   ./stop.sh"
echo ""

# 健康检查
sleep 3
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 后端服务正常"
else
    echo "⚠️  后端启动中，请稍等..."
fi

if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ 前端服务正常"
else
    echo "⚠️  前端启动中，请稍等..."
fi

echo ""
echo "💡 在浏览器中打开: http://localhost:5173"


