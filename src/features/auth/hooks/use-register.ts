import { authControllerLogin, useAuthControllerRegister } from '@/api/generated/endpoints/auth/auth';
import { usersControllerGetProfile } from '@/api/generated/endpoints/users/users';
import { useAuthStore } from '@/store/auth.store';

export const useRegister = () => {
  const { setTokens, setUser } = useAuthStore();

  return useAuthControllerRegister({
    mutation: {
      onSuccess: async (_, variables) => {
        const loginResult = await authControllerLogin({
          email: variables.data.email,
          password: variables.data.password,
        });
        setTokens(loginResult.accessToken, loginResult.refreshToken);
        const profile = await usersControllerGetProfile();
        setUser(profile);
      },
    },
  });
};
