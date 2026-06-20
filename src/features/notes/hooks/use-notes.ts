import { useNotesControllerFindByFile } from '@/api/generated/endpoints/notes/notes';

export const useNotes = (fileId: string) => {
  const query = useNotesControllerFindByFile(fileId);
  return { ...query, data: query.data?.data ?? [] };
};
