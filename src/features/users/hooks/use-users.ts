import { useUsersControllerFindAll } from '@/api/generated/endpoints/users/users';

export const useUsers = () => {
  const query = useUsersControllerFindAll();
  return { ...query, data: query.data ?? [] };
};
