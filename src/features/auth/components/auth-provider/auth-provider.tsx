import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { authControllerRefresh } from '@/api/generated/endpoints/auth/auth';
import { usersControllerGetProfile } from '@/api/generated/endpoints/users/users';
import { getRefreshToken, useAuthStore } from '@/store/auth.store';
import { isAuthUser, isTokenPair } from '@/utils/api.utils';

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

    authControllerRefresh({ refreshToken })
      .then((refreshResult) => {
        const tokens: unknown = refreshResult;
        if (!isTokenPair(tokens)) {
          throw new Error('Unexpected refresh response');
        }
        setTokens(tokens.accessToken, tokens.refreshToken);
        return usersControllerGetProfile();
      })
      .then((profileResult) => {
        const user: unknown = profileResult;
        if (!isAuthUser(user)) {
          throw new Error('Unexpected profile response');
        }
        setUser(user);
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
