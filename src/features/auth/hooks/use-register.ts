import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import { AuthUser, TokenPair } from '@/types/auth';

type RegisterData = {
  email: string;
  name: string;
  username: string;
  password: string;
};

export const useRegister = () => {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      await api.post('/auth/register', data);
      const { data: tokens } = await api.post<TokenPair>('/auth/login', {
        email: data.email,
        password: data.password,
      });
      setTokens(tokens.accessToken, tokens.refreshToken);
      const { data: user } = await api.get<AuthUser>('/users/me');
      setUser(user);
      return user;
    },
  });
};
