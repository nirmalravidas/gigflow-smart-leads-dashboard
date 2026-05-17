import { Request } from 'express';
import { Types } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';
import { IUserPublic } from './user.interface';

export interface IJwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResult {
  user: IUserPublic;
  tokens: ITokenPair;
}