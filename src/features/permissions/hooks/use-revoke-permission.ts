import {
  getPermissionsControllerListQueryKey,
  usePermissionsControllerRevoke,
} from '@/api/generated/endpoints/permissions/permissions';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useRevokePermission = () => {
  const { add } = useNotifications();

  return usePermissionsControllerRevoke({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getPermissionsControllerListQueryKey() });
        add('Доступ отозван', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
