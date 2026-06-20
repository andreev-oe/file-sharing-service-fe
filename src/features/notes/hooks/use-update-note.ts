import { getNotesControllerFindByFileQueryKey, useNotesControllerUpdate } from '@/api/generated/endpoints/notes/notes';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useUpdateNote = (fileId: string) => {
  const { add } = useNotifications();

  return useNotesControllerUpdate({
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
