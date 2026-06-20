import {
  getFilesControllerFindByFolderQueryKey,
  useFilesControllerUpdate,
} from '@/api/generated/endpoints/files/files';
import type { UpdateFileDtoFolderId } from '@/api/generated/types';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useUpdateFile = (folderId: string) => {
  const { add } = useNotifications();

  const mutation = useFilesControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getFilesControllerFindByFolderQueryKey({ folderId }),
        });
        add('Файл обновлён', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });

  const mutateAsync = ({ id, data }: { id: string; data: { name?: string; folderId?: string | null } }) => {
    return mutation.mutateAsync({
      id,
      data: {
        name: data.name,
        // orval mistype: generates { [key: string]: unknown } | null instead of string | null
        folderId: data.folderId as unknown as UpdateFileDtoFolderId,
      },
    });
  };

  return { ...mutation, mutateAsync };
};
