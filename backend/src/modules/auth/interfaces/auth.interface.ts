import { ITokenPair, IUser, IUserPublic, UserRole } from '@/shared/types';
import { Document } from 'mongoose';
import { ISigninDto, ISignupDto } from '../dto/auth.dto';

// user document interfce
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// create user interface
export interface ICreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

// auth service interface
export interface IAuthService {
  signup(dto: ISignupDto): Promise<{ user: IUserPublic }>;
  signin(dto: ISigninDto): Promise<{ user: IUserPublic; tokens: ITokenPair }>;
  signout(userId: string): Promise<void>;
  verifyEmail(token: string): Promise<{ user: IUserPublic }>;
  resendVerificationEmail(email: string): Promise<void>;
  refreshTokens(refreshToken: string): Promise<ITokenPair>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  getProfile(userId: string): Promise<IUserPublic>;
}

// auth repository interface
export interface IAuthRepository {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findById(id: string): Promise<IUserDocument | null>;
  findByVerificationToken(rawToken: string): Promise<IUserDocument | null>;
  findByResetToken(rawToken: string): Promise<IUserDocument | null>;
  emailExists(email: string): Promise<boolean>;
  create(dto: ICreateUserDto): Promise<IUserDocument>;
  setRefreshToken(userId: string, rawToken: string | undefined): Promise<void>;
  markEmailVerified(userId: string): Promise<void>;
  setVerificationToken(userId: string, rawToken: string, expires: Date): Promise<void>;
  setResetToken(userId: string, rawToken: string, expires: Date): Promise<void>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  clearResetToken(userId: string): Promise<void>;
  clearRefreshToken(userId: string): Promise<void>;
}

// auth dao interface
export interface IAuthDao {
  findUserByEmail(email: string): Promise<IUserDocument | null>;
  findUserById(id: string): Promise<IUserDocument | null>;
  findUserByTokenField(field: string, hashedToken: string, expiryField: string): Promise<IUserDocument | null>;
  findUserByRefreshToken(hashedToken: string): Promise<IUserDocument | null>;
  createUser(data: ICreateUserDto): Promise<IUserDocument>;
  updateUser(id: string, updates: Partial<Record<string, unknown>>): Promise<IUserDocument | null>;
  unsetFields(id: string, fields: string[]): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}
