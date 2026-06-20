import { useAuthControllerLogin } from '@/api/generated/endpoints/auth/auth';
import { usersControllerGetProfile } from '@/api/generated/endpoints/users/users';
import { useAuthStore } from '@/store/auth.store';

export const useLogin = () => {
  const { setTokens, setUser } = useAuthStore();

  return useAuthControllerLogin({
    mutation: {
      onSuccess: async (data) => {
        setTokens(data.accessToken, data.refreshToken);
        const profile = await usersControllerGetProfile();
        setUser(profile);
      },
    },
  });
};
