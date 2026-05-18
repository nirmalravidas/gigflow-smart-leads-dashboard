import api from './client';
import type { IApiResponse, IUser, ITokenPair, ISignupDto, ISigninDto } from '../types';

export const authApi = {
  signup: (dto: ISignupDto) =>
    api.post<IApiResponse<{ user: IUser }>>('/auth/signup', dto),

  signin: (dto: ISigninDto) =>
    api.post<IApiResponse<{ user: IUser; tokens: ITokenPair }>>('/auth/signin', dto),

  signout: () =>
    api.post<IApiResponse>('/auth/signout'),

  getProfile: () =>
    api.get<IApiResponse<IUser>>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post<IApiResponse>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<IApiResponse>('/auth/reset-password', { token, password }),

  verifyEmail: (token: string) =>
    api.post<IApiResponse<{ user: IUser }>>('/auth/verify-email', { token }),

  resendVerification: (email: string) =>
    api.post<IApiResponse>('/auth/resend-verification', { email }),
};
