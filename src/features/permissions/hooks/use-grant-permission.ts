import { usePermissionsControllerGrant } from '@/api/generated/endpoints/permissions/permissions';
import { useNotifications } from '@/components/ui/notifications';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useGrantPermission = () => {
  const { add } = useNotifications();

  return usePermissionsControllerGrant({
    mutation: {
      onSuccess: () => {
        add('Доступ предоставлен', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
