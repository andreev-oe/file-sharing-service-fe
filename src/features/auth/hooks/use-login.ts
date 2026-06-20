import { useAuthControllerLogin } from '@/api/generated/endpoints/auth/auth';
import { usersControllerGetProfile } from '@/api/generated/endpoints/users/users';
import { useAuthStore } from '@/store/auth.store';
import { isAuthUser, isTokenPair } from '@/utils/api.utils';

export const useLogin = () => {
  const { setTokens, setUser } = useAuthStore();

  return useAuthControllerLogin({
    mutation: {
      onSuccess: async (data) => {
        const tokens: unknown = data;
        if (!isTokenPair(tokens)) {
          return;
        }
        setTokens(tokens.accessToken, tokens.refreshToken);
        const profileResult: unknown = await usersControllerGetProfile();
        if (isAuthUser(profileResult)) {
          setUser(profileResult);
        }
      },
    },
  });
};
