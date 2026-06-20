import { Box, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export type FileUploadProgressProps = {
  fileName: string;
  progress: number;
};

export const FileUploadProgress = ({ fileName, progress }: FileUploadProgressProps) => {
  return (
    <ProgressRoot>
      <ProgressHeader>
        <Typography variant={'body2'} noWrap>
          {fileName}
        </Typography>
        <ProgressPercent variant={'body2'} color={'text.secondary'}>
          {progress}%
        </ProgressPercent>
      </ProgressHeader>
      <LinearProgress variant={'determinate'} value={progress} />
    </ProgressRoot>
  );
};

const ProgressRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.hover,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const ProgressHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
});

const ProgressPercent = styled(Typography)({
  flexShrink: 0,
  fontSize: 12,
});
