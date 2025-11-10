import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../types';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Zod 验证错误
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    const response: ApiResponse = {
      message: `Validation failed: ${message}`,
      data: null,
    };
    return res.status(400).json(response);
  }

  // 自定义应用错误
  if (err instanceof AppError) {
    const response: ApiResponse = {
      message: err.message,
      data: null,
    };
    return res.status(err.statusCode).json(response);
  }

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const response: ApiResponse = {
      message: 'Data validation failed. Please check your input.',
      data: null,
    };
    return res.status(400).json(response);
  }

  // Mongoose 重复键错误
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    const response: ApiResponse = {
      message: `${field} already exists. Please use a different value.`,
      data: null,
    };
    return res.status(400).json(response);
  }

  // Mongoose CastError (无效的 ObjectId)
  if (err.name === 'CastError') {
    const response: ApiResponse = {
      message: 'Invalid resource identifier provided.',
      data: null,
    };
    return res.status(400).json(response);
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    const response: ApiResponse = {
      message: 'Invalid authentication token.',
      data: null,
    };
    return res.status(401).json(response);
  }

  if (err.name === 'TokenExpiredError') {
    const response: ApiResponse = {
      message: 'Authentication token has expired.',
      data: null,
    };
    return res.status(401).json(response);
  }

  // 默认服务器错误
  const response: ApiResponse = {
    message: 'An unexpected error occurred. Please try again later.',
    data: null,
  };
  res.status(500).json(response);
};

