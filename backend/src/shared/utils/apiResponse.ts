import { Response } from 'express';
import { IApiResponse } from '../interfaces/api-response.interface';
import {
  IPaginatedResponse,
  IPaginationMeta,
} from '../interfaces/pagination.interface';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
): Response => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Record<string, string>[],
): Response => {
  const response: IApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T[],
  meta: IPaginationMeta,
): Response => {
  const response: IApiResponse<IPaginatedResponse<T>> = {
    success: true,
    message,
    data: { data, meta },
  };
  return res.status(200).json(response);
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): IPaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
