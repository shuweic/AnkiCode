import { Response } from 'express';
import { ApiResponse } from '../types';

export function sendSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, message: string, data: T): void {
  sendSuccess(res, message, data, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

