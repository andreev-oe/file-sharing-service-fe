import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import { AuthUser } from '@/types/auth';

import { PROFILE_QUERY_KEY } from './use-profile';

export const useUploadAvatar = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data: user } = await api.post<AuthUser>('/users/me/avatar', formData);
      return user;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(PROFILE_QUERY_KEY, user);
    },
  });
};
