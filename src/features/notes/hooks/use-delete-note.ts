import { getNotesControllerFindByFileQueryKey, useNotesControllerRemove } from '@/api/generated/endpoints/notes/notes';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useDeleteNote = (fileId: string) => {
  const { add } = useNotifications();

  return useNotesControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getNotesControllerFindByFileQueryKey(fileId) });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
