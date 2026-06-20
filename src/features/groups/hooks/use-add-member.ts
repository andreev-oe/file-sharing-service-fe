import {
  getGroupsControllerGetMembersQueryKey,
  useGroupsControllerAddMember,
} from '@/api/generated/endpoints/groups/groups';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useAddMember = (groupId: string) => {
  const { add } = useNotifications();

  return useGroupsControllerAddMember({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGroupsControllerGetMembersQueryKey(groupId) });
        add('Участник добавлен', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
