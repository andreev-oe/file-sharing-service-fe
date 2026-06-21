import { useMemo } from 'react';

import { useFilesControllerFindByIds } from '@/api/generated/endpoints/files/files';
import { useFoldersControllerFindByIds } from '@/api/generated/endpoints/folders/folders';
import { PermissionDtoResourceType as ResourceType } from '@/api/generated/types';
import type { PermissionDto } from '@/api/generated/types';

export const useResourceNames = (permissions: PermissionDto[]): Map<string, string> => {
  const fileIds = useMemo(
    () => permissions.filter((p) => p.resourceType === ResourceType.file).map((p) => p.resourceId),
    [permissions],
  );

  const folderIds = useMemo(
    () => permissions.filter((p) => p.resourceType === ResourceType.folder).map((p) => p.resourceId),
    [permissions],
  );

  const { data: fileNames } = useFilesControllerFindByIds(
    { ids: fileIds.join(',') },
    { query: { enabled: fileIds.length > 0 } },
  );

  const { data: folderNames } = useFoldersControllerFindByIds(
    { ids: folderIds.join(',') },
    { query: { enabled: folderIds.length > 0 } },
  );

  return useMemo(() => {
    const nameById = new Map<string, string>();
    for (const file of fileNames ?? []) {
      nameById.set(file.id, file.name);
    }
    for (const folder of folderNames ?? []) {
      nameById.set(folder.id, folder.name);
    }
    return nameById;
  }, [fileNames, folderNames]);
};
