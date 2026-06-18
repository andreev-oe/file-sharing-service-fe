import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import { AuthUser, TokenPair } from '@/types/auth';

type LoginData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const { data: tokens } = await api.post<TokenPair>('/auth/login', credentials);
      setTokens(tokens.accessToken, tokens.refreshToken);
      const { data: user } = await api.get<AuthUser>('/users/me');
      setUser(user);
      return user;
    },
  });
};
