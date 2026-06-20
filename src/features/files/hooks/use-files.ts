import {
  getFilesControllerFindByFolderQueryKey,
  useFilesControllerFindByFolder,
} from '@/api/generated/endpoints/files/files';
import type { FileRecord } from '@/types/files';
import { isFileRecordArray } from '@/utils/api.utils';

export { getFilesControllerFindByFolderQueryKey as getFilesQueryKey };

export const useFiles = (folderId: string) => {
  const query = useFilesControllerFindByFolder({ folderId });
  const rawData: unknown = query.data;
  const files: FileRecord[] = isFileRecordArray(rawData) ? rawData : [];
  return { ...query, data: files };
};
