import { LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

export type FileUploadProgressProps = {
  progress: number;
};

export const FileUploadProgress = ({ progress }: FileUploadProgressProps) => {
  return <UploadProgressBar variant={'determinate'} value={progress} />;
};

const UploadProgressBar = styled(LinearProgress)({
  height: 8,
  borderRadius: 4,
});
