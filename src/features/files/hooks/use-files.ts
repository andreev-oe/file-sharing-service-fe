import {
  getFilesControllerFindByFolderQueryKey,
  useFilesControllerFindByFolder,
} from '@/api/generated/endpoints/files/files';

export { getFilesControllerFindByFolderQueryKey as getFilesQueryKey };

export const useFiles = (folderId: string) => {
  const query = useFilesControllerFindByFolder({ folderId });
  return { ...query, data: query.data ?? [] };
};
