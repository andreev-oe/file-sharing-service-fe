import { useReportsControllerEnqueue } from '@/api/generated/endpoints/reports/reports';
import { useNotifications } from '@/components/ui/notifications';
import { getApiErrorMessage } from '@/utils/api.utils';

export const useEnqueueReport = () => {
  const { add } = useNotifications();

  return useReportsControllerEnqueue({
    mutation: {
      onSuccess: () => {
        add('Задача поставлена в очередь', { variant: 'success' });
      },
      onError: (error) => {
        add(getApiErrorMessage(error), { variant: 'error' });
      },
    },
  });
};
