import { getNotesControllerFindByFileQueryKey, useNotesControllerCreate } from '@/api/generated/endpoints/notes/notes';
import { useNotifications } from '@/components/ui/notifications';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useCreateNote = (fileId: string) => {
  const { add } = useNotifications();

  return useNotesControllerCreate({
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
