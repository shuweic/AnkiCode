import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { registerSchema, loginSchema } from '../validators/auth';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/responseWrapper';
import { AppError } from '../middleware/errorHandler';

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new AppError('Email already registered. Please use a different email.', 400);
    }

    // 哈希密码
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // 创建用户
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      problemIds: [],
      settings: {
        notifications: {
          optIn: true,
        },
        skipWeekends: false,
      },
    });

    // 生成 JWT
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    sendCreated(res, 'User registered successfully.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // 查找用户
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    // 生成 JWT
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    sendSuccess(res, 'Login successful.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 客户端应删除 token
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    sendSuccess(res, 'User retrieved successfully.', {
      id: user._id,
      name: user.name,
      email: user.email,
      settings: user.settings,
      problemIds: user.problemIds,
    });
  } catch (error) {
    next(error);
  }
};

