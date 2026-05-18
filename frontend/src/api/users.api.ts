import api from './client';
import type { IApiResponse, IUser } from '../types';
import { UserRole } from '../types';

export const usersApi = {
  listUsers: () =>
    api.get<IApiResponse<{ users: IUser[]; total: number }>>('/users'),

  getUser: (id: string) =>
    api.get<IApiResponse<IUser>>(`/users/${id}`),

  updateRole: (id: string, role: UserRole) =>
    api.patch<IApiResponse<IUser>>(`/users/${id}/role`, { role }),

  deleteUser: (id: string) =>
    api.delete<IApiResponse>(`/users/${id}`),
};
