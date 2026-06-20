import {
  getGroupsControllerGetMembersQueryKey,
  useGroupsControllerTransferOwnership,
} from '@/api/generated/endpoints/groups/groups';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useTransferOwnership = (groupId: string) => {
  const { add } = useNotifications();

  return useGroupsControllerTransferOwnership({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGroupsControllerGetMembersQueryKey(groupId) });
        add('Права владельца переданы', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
