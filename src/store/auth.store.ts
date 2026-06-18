import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AuthUser } from '@/types/auth';

const REFRESH_TOKEN_KEY = 'refresh_token';

export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

interface AuthStore {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        set({ accessToken, isAuthenticated: true }, undefined, 'auth/setTokens');
      },
      setUser: (user) => {
        set({ user }, undefined, 'auth/setUser');
      },
      clearAuth: () => {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        set({ accessToken: null, user: null, isAuthenticated: false }, undefined, 'auth/clearAuth');
      },
    }),
    { name: 'auth' },
  ),
);
