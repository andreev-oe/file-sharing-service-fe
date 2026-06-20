import {
  getFilesControllerFindByFolderQueryKey,
  useFilesControllerSoftDelete,
} from '@/api/generated/endpoints/files/files';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useDeleteFile = (folderId: string) => {
  const { add } = useNotifications();

  return useFilesControllerSoftDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getFilesControllerFindByFolderQueryKey({ folderId }),
        });
        add('Файл удалён', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
