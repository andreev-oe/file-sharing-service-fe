import { useReportsControllerGetStatus } from '@/api/generated/endpoints/reports/reports';
import type { ReportStatusDto } from '@/api/generated/types';

const POLLING_INTERVAL_MS = 2000;
const STATUS_COMPLETED = 'completed';
const STATUS_FAILED = 'failed';

export const useReportStatus = (jobId: string, initialData?: ReportStatusDto) => {
  return useReportsControllerGetStatus(jobId, {
    query: {
      initialData,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (status === STATUS_COMPLETED || status === STATUS_FAILED) {
          return false;
        }
        return POLLING_INTERVAL_MS;
      },
    },
  });
};
