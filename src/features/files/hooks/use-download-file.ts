import { useState } from 'react';

import { filesControllerGetDownloadUrl } from '@/api/generated/endpoints/files/files';

export const useDownloadFile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async (fileId: string) => {
    setIsLoading(true);
    try {
      const response = await filesControllerGetDownloadUrl(fileId);
      window.open(response.url, '_blank');
    } catch (_error) {
      // errors handled by api interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return { download, isLoading };
};
