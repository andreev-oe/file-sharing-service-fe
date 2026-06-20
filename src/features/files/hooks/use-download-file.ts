import { useState } from 'react';

import { filesControllerGetDownloadUrl } from '@/api/generated/endpoints/files/files';
import { hasUrlField, isDownloadUrlResponse } from '@/utils/api.utils';

export const useDownloadFile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async (fileId: string) => {
    setIsLoading(true);
    try {
      const response: unknown = await filesControllerGetDownloadUrl(fileId);
      if (isDownloadUrlResponse(response)) {
        window.open(response, '_blank');
      } else if (hasUrlField(response)) {
        window.open(response.url, '_blank');
      }
    } catch (_error) {
      // errors handled by api interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return { download, isLoading };
};
