import {
  getGroupsControllerGetMembersQueryKey,
  useGroupsControllerGetMembers,
} from '@/api/generated/endpoints/groups/groups';
import type { GroupMember } from '@/types/groups';
import { isGroupMemberArray } from '@/utils/api.utils';

export { getGroupsControllerGetMembersQueryKey as getGroupMembersQueryKey };

export const useGroupMembers = (groupId: string) => {
  const query = useGroupsControllerGetMembers(groupId);
  const rawData: unknown = query.data;
  const members: GroupMember[] = isGroupMemberArray(rawData) ? rawData : [];
  return { ...query, data: members };
};
