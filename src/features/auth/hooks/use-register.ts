import { authControllerLogin, useAuthControllerRegister } from '@/api/generated/endpoints/auth/auth';
import { usersControllerGetProfile } from '@/api/generated/endpoints/users/users';
import { useAuthStore } from '@/store/auth.store';
import { isAuthUser, isTokenPair } from '@/utils/api.utils';

export const useRegister = () => {
  const { setTokens, setUser } = useAuthStore();

  return useAuthControllerRegister({
    mutation: {
      onSuccess: async (_, variables) => {
        const loginResult: unknown = await authControllerLogin({
          email: variables.data.email,
          password: variables.data.password,
        });
        if (!isTokenPair(loginResult)) {
          return;
        }
        setTokens(loginResult.accessToken, loginResult.refreshToken);
        const profileResult: unknown = await usersControllerGetProfile();
        if (isAuthUser(profileResult)) {
          setUser(profileResult);
        }
      },
    },
  });
};
