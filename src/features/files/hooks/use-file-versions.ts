import { useFilesControllerGetVersions } from '@/api/generated/endpoints/files/files';
import type { FileVersion } from '@/types/files';
import { isFileVersionArray } from '@/utils/api.utils';

export const useFileVersions = (fileId: string) => {
  const query = useFilesControllerGetVersions(fileId);
  const rawData: unknown = query.data;
  const versions: FileVersion[] = isFileVersionArray(rawData) ? rawData : [];
  return { ...query, data: versions };
};
