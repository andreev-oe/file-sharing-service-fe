import { useState } from 'react';

import { getFilesControllerFindByFolderQueryKey } from '@/api/generated/endpoints/files/files';
import { useNotifications } from '@/components/ui/notifications';
import { customAxiosInstance } from '@/lib/custom-axios-instance';
import { queryClient } from '@/lib/react-query';
import { getApiErrorMessage } from '@/utils/api.utils';

export type UploadFileInput = {
  folderId: string;
  file: File;
};

// customAxiosInstance is used directly because the generated filesControllerUpload
// does not include a request body (the spec omits the multipart/form-data requestBody definition).
// onUploadProgress also requires direct axios config access.
export const useUploadFile = () => {
  const { add } = useNotifications();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async ({ folderId, file }: UploadFileInput) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await customAxiosInstance<void>({
        url: '/files/upload',
        method: 'POST',
        params: { folderId },
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      queryClient.invalidateQueries({
        queryKey: getFilesControllerFindByFolderQueryKey({ folderId }),
      });
      add('Файл загружен', { variant: 'success' });
    } catch (error) {
      add(getApiErrorMessage(error), { variant: 'error' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { upload, isUploading, uploadProgress };
};
