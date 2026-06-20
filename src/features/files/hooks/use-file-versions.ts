import { useFilesControllerGetVersions } from '@/api/generated/endpoints/files/files';

export const useFileVersions = (fileId: string) => {
  const query = useFilesControllerGetVersions(fileId);
  return { ...query, data: query.data ?? [] };
};
