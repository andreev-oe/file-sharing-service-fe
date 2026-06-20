import {
  getUsersControllerGetProfileQueryKey,
  useUsersControllerGetProfile,
} from '@/api/generated/endpoints/users/users';

export { getUsersControllerGetProfileQueryKey };

export const useProfile = () => {
  return useUsersControllerGetProfile();
};
