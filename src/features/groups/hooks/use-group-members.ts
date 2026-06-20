import {
  getGroupsControllerGetMembersQueryKey,
  useGroupsControllerGetMembers,
} from '@/api/generated/endpoints/groups/groups';

export { getGroupsControllerGetMembersQueryKey as getGroupMembersQueryKey };

export const useGroupMembers = (groupId: string) => {
  const query = useGroupsControllerGetMembers(groupId);
  return { ...query, data: query.data ?? [] };
};
