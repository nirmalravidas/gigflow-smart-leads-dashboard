import { UserRole } from "../../../types";

// Signup DTO
export interface ISignupDto {
    name: string;
    email: string;
    password: string;
    role?:UserRole;
}

// Signin DTO
export interface ISigninDto {
    email: string;
    password: string;
}

// verify email DTO
export interface IVerifyEmailDto {
  token: string;
}

// resend verification DTO
export interface IResendVerificationDto {
  email: string;
}

// Refresh Token DTO
export interface IRefreshTokenDto {
  refreshToken: string;
}

// Forgot Password DTO
export interface IForgotPasswordDto {
  email: string;
}

// Reset Password DTO
export interface IResetPasswordDto {
  token: string;
  password: string;
}


// Auth Response DTO
export interface IAuthResponseDto {
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: Date;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}