import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors/AppError';
import { config } from '../config/env';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Operational, known errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.server.isProduction ? {} : { stack: err.stack }),
    });
    return;
  }

  // Mongoose / Mongo errors (best-effort mapping)
  if (err && typeof err === 'object') {
    const anyErr = err as any;

    // Duplicate key error
    if (anyErr.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Duplicate value. Please use a different value.',
        ...(config.server.isProduction ? {} : { details: anyErr.keyValue }),
      });
      return;
    }

    // Validation / cast errors
    if (anyErr.name === 'ValidationError' || anyErr.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        ...(config.server.isProduction ? {} : { details: anyErr.message }),
      });
      return;
    }
  }

  // Fallback
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(config.server.isProduction ? {} : { stack: (err as Error)?.stack }),
  });
};

