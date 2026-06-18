import { useQueryClient, useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { getRefreshToken, useAuthStore } from '@/store/auth.store';

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {});
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
};
