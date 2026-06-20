import {
  getGroupsControllerGetMembersQueryKey,
  useGroupsControllerRemoveMember,
} from '@/api/generated/endpoints/groups/groups';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useRemoveMember = (groupId: string) => {
  const { add } = useNotifications();

  return useGroupsControllerRemoveMember({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGroupsControllerGetMembersQueryKey(groupId) });
        add('Участник удалён', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
