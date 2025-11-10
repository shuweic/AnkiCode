#!/bin/bash

# Ankicode 停止脚本

echo "🛑 停止 Ankicode 服务..."
echo ""

# 停止后端
if pgrep -f "tsx watch" > /dev/null; then
    pkill -f "tsx watch"
    echo "✅ 后端已停止"
else
    echo "ℹ️  后端未运行"
fi

# 停止前端
if pgrep -f "vite" > /dev/null; then
    pkill -f "vite"
    echo "✅ 前端已停止"
else
    echo "ℹ️  前端未运行"
fi

echo ""
echo "🎉 所有服务已停止"


