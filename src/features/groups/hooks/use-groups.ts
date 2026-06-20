import {
  getGroupsControllerFindAllQueryKey,
  useGroupsControllerFindAll,
} from '@/api/generated/endpoints/groups/groups';

export { getGroupsControllerFindAllQueryKey as getGroupsQueryKey };

export const useGroups = () => {
  const query = useGroupsControllerFindAll();
  return { ...query, data: query.data ?? [] };
};
