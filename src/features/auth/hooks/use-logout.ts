import { useAuthControllerLogout } from '@/api/generated/endpoints/auth/auth';
import { queryClient } from '@/lib/react-query';
import { getRefreshToken, useAuthStore } from '@/store/auth.store';

export const useLogout = () => {
  const { clearAuth } = useAuthStore();

  const mutation = useAuthControllerLogout({
    mutation: {
      onSettled: () => {
        clearAuth();
        queryClient.clear();
      },
    },
  });

  return {
    ...mutation,
    mutate: () => mutation.mutate({ data: { refreshToken: getRefreshToken() ?? '' } }),
    mutateAsync: () => mutation.mutateAsync({ data: { refreshToken: getRefreshToken() ?? '' } }),
  };
};
