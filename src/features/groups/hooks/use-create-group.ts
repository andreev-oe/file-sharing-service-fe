import { getGroupsControllerFindAllQueryKey, useGroupsControllerCreate } from '@/api/generated/endpoints/groups/groups';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useCreateGroup = () => {
  const { add } = useNotifications();

  return useGroupsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGroupsControllerFindAllQueryKey() });
        add('Группа создана', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
