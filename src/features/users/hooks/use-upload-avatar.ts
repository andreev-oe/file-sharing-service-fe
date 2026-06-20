import {
  getUsersControllerGetProfileQueryKey,
  useUsersControllerUploadAvatar,
} from '@/api/generated/endpoints/users/users';
import { queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth.store';
import { isAuthUser } from '@/utils/api.utils';

export const useUploadAvatar = () => {
  const { setUser } = useAuthStore();

  return useUsersControllerUploadAvatar({
    mutation: {
      onSuccess: (result) => {
        const user: unknown = result;
        if (isAuthUser(user)) {
          setUser(user);
        }
        void queryClient.invalidateQueries({ queryKey: getUsersControllerGetProfileQueryKey() });
      },
    },
  });
};
