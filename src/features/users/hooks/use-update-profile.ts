import {
  getUsersControllerGetProfileQueryKey,
  useUsersControllerUpdateProfile,
} from '@/api/generated/endpoints/users/users';
import { queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth.store';
import { isAuthUser } from '@/utils/api.utils';

export const useUpdateProfile = () => {
  const { setUser } = useAuthStore();

  return useUsersControllerUpdateProfile({
    mutation: {
      onSuccess: (result) => {
        const user: unknown = result;
        if (isAuthUser(user)) {
          setUser(user);
        }
        queryClient.invalidateQueries({ queryKey: getUsersControllerGetProfileQueryKey() });
      },
    },
  });
};
