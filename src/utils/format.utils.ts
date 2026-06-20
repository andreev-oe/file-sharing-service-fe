import { default as dayjs } from 'dayjs';

export const formatDate = (date: number) => dayjs(date).format('MMMM D, YYYY h:mm A');

const FILE_SIZE_KB = 1024;
const FILE_SIZE_MB = 1024 * 1024;
const FILE_SIZE_GB = 1024 * 1024 * 1024;

export const formatFileSize = (bytes: number): string => {
  if (bytes < FILE_SIZE_KB) {
    return `${bytes} B`;
  }
  if (bytes < FILE_SIZE_MB) {
    return `${(bytes / FILE_SIZE_KB).toFixed(1)} KB`;
  }
  if (bytes < FILE_SIZE_GB) {
    return `${(bytes / FILE_SIZE_MB).toFixed(1)} MB`;
  }
  return `${(bytes / FILE_SIZE_GB).toFixed(1)} GB`;
};
