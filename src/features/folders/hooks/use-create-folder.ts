import {
  getFoldersControllerGetTreeQueryKey,
  useFoldersControllerCreate,
} from '@/api/generated/endpoints/folders/folders';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useCreateFolder = () => {
  const { add } = useNotifications();

  return useFoldersControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getFoldersControllerGetTreeQueryKey() });
        add('Папка создана', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
