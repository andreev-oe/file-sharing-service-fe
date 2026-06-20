import {
  getUsersControllerGetProfileQueryKey,
  useUsersControllerUploadAvatar,
} from '@/api/generated/endpoints/users/users';
import { queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth.store';

export const useUploadAvatar = () => {
  const { setUser } = useAuthStore();

  return useUsersControllerUploadAvatar({
    mutation: {
      onSuccess: (result) => {
        setUser(result);
        void queryClient.invalidateQueries({ queryKey: getUsersControllerGetProfileQueryKey() });
      },
    },
  });
};
