import { useNavigate } from 'react-router-dom';

import { getGroupsControllerFindAllQueryKey, useGroupsControllerDelete } from '@/api/generated/endpoints/groups/groups';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useDeleteGroup = () => {
  const { add } = useNotifications();
  const navigate = useNavigate();

  return useGroupsControllerDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGroupsControllerFindAllQueryKey() });
        add('Группа удалена', { variant: 'success' });
        navigate(paths.groups.getHref());
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
