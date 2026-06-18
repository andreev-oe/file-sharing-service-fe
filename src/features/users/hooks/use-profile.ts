import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { AuthUser } from '@/types/auth';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<AuthUser>('/users/me');
      return data;
    },
  });
};
