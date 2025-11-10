import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import problemRoutes from './routes/problems';
import reminderRoutes from './routes/reminders';
import dashboardRoutes from './routes/dashboard';
import settingsRoutes from './routes/settings';
import leetcodeRoutes from './routes/leetcode';
import { sendSuccess } from './utils/responseWrapper';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 安全中间件
app.use(helmet());

// CORS 配置
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 速率限制 - 仅应用于认证端点
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 10, // 限制 10 次请求
  message: { message: 'Too many requests. Please try again later.', data: null },
  standardHeaders: true,
  legacyHeaders: false,
});

// 健康检查
app.get('/api/health', (req: Request, res: Response) => {
  sendSuccess(res, 'Server is running', {
    uptime: process.uptime(),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 路由
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/leetcode', leetcodeRoutes); // LeetCode API 代理

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint not found.',
    data: null,
  });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDatabase();

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API documentation: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

