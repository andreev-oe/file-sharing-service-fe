import {
  getFoldersControllerGetTreeQueryKey,
  useFoldersControllerUpdate,
} from '@/api/generated/endpoints/folders/folders';
import type { UpdateFolderDtoParentId } from '@/api/generated/types';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export type UpdateFolderInput = {
  id: string;
  data: { name?: string; parentId?: string | null };
};

export const useUpdateFolder = () => {
  const { add } = useNotifications();

  const mutation = useFoldersControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getFoldersControllerGetTreeQueryKey() });
        add('Папка обновлена', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });

  const mutateAsync = ({ id, data }: UpdateFolderInput) => {
    return mutation.mutateAsync({
      id,
      data: {
        name: data.name,
        // orval mistype: generates { [key: string]: unknown } | null instead of string | null
        parentId: data.parentId as unknown as UpdateFolderDtoParentId,
      },
    });
  };

  return { ...mutation, mutateAsync };
};
