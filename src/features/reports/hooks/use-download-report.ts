import { useState } from 'react';

import { reportsControllerGetDownloadUrl } from '@/api/generated/endpoints/reports/reports';

export const useDownloadReport = () => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async (jobId: string) => {
    setIsLoading(true);
    try {
      const response = await reportsControllerGetDownloadUrl(jobId);
      window.open(response.url, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  return { download, isLoading };
};
