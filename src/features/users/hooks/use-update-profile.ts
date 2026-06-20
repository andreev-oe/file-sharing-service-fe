import {
  getUsersControllerGetProfileQueryKey,
  useUsersControllerUpdateProfile,
} from '@/api/generated/endpoints/users/users';
import { queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth.store';

export const useUpdateProfile = () => {
  const { setUser } = useAuthStore();

  return useUsersControllerUpdateProfile({
    mutation: {
      onSuccess: (result) => {
        setUser(result);
        queryClient.invalidateQueries({ queryKey: getUsersControllerGetProfileQueryKey() });
      },
    },
  });
};
