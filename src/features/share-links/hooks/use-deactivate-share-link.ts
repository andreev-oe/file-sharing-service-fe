import { useShareLinksControllerDeactivate } from '@/api/generated/endpoints/share-links/share-links';
import { useNotifications } from '@/components/ui/notifications';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useDeactivateShareLink = () => {
  const { add } = useNotifications();

  return useShareLinksControllerDeactivate({
    mutation: {
      onSuccess: () => {
        add('Ссылка деактивирована', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
