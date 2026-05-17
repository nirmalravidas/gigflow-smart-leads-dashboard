import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../../../config/env';
import { IJwtPayload, ITokenPair, UserRole } from '../../types';

export const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const generateTokenPair = (
  userId: string,
  email: string,
  role: UserRole,
): ITokenPair => {
  const payload: IJwtPayload = { userId, email, role };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.secret) as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as IJwtPayload;
};

export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
