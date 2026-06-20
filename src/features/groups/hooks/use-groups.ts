import {
  getGroupsControllerFindAllQueryKey,
  useGroupsControllerFindAll,
} from '@/api/generated/endpoints/groups/groups';
import type { Group } from '@/types/groups';
import { isGroupArray } from '@/utils/api.utils';

export { getGroupsControllerFindAllQueryKey as getGroupsQueryKey };

export const useGroups = () => {
  const query = useGroupsControllerFindAll();
  const rawData: unknown = query.data;
  const groups: Group[] = isGroupArray(rawData) ? rawData : [];
  return { ...query, data: groups };
};
