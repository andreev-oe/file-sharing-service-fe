import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import { AuthUser } from '@/types/auth';

import { PROFILE_QUERY_KEY } from './use-profile';

type UpdateProfileData = {
  name?: string;
  bio?: string;
};

export const useUpdateProfile = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const { data: user } = await api.patch<AuthUser>('/users/me', data);
      return user;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(PROFILE_QUERY_KEY, user);
    },
  });
};
