import { create } from 'zustand';
import type { IUser, ITokenPair } from '../types';

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: IUser, tokens: ITokenPair) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  setAuth: (user, tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    set({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
    });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.clear();
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  setLoading: (v) => set({ isLoading: v }),
}));
