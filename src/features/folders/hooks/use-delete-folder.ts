import {
  getFoldersControllerGetTreeQueryKey,
  useFoldersControllerSoftDelete,
} from '@/api/generated/endpoints/folders/folders';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useDeleteFolder = () => {
  const { add } = useNotifications();

  return useFoldersControllerSoftDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getFoldersControllerGetTreeQueryKey() });
        add('Папка удалена', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
