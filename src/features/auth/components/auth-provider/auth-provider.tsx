import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { api } from '@/lib/api-client';
import { getRefreshToken, useAuthStore } from '@/store/auth.store';
import { AuthUser, TokenPair } from '@/types/auth';

type AuthContextValue = {
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ isLoading: true });

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setTokens, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    api
      .post<TokenPair>('/auth/refresh', { refreshToken })
      .then(({ data }) => {
        setTokens(data.accessToken, data.refreshToken);
        return api.get<AuthUser>('/users/me');
      })
      .then(({ data }) => {
        setUser(data);
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [clearAuth, setTokens, setUser]);

  return <AuthContext.Provider value={{ isLoading }}>{children}</AuthContext.Provider>;
};
