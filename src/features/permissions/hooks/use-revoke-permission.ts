import { usePermissionsControllerRevoke } from '@/api/generated/endpoints/permissions/permissions';
import { useNotifications } from '@/components/ui/notifications';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useRevokePermission = () => {
  const { add } = useNotifications();

  return usePermissionsControllerRevoke({
    mutation: {
      onSuccess: () => {
        add('Доступ отозван', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
