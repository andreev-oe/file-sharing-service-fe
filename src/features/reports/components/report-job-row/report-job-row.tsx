import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SyncIcon from '@mui/icons-material/Sync';
import { Box, Chip, LinearProgress, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { ReportJobDto, ReportStatusDto } from '@/api/generated/types';
import { ReportJobDtoFormat } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format.utils';

import { useDownloadReport } from '../../hooks/use-download-report';
import { useReportStatus } from '../../hooks/use-report-status';

const STATUS_COMPLETED = 'completed';
const STATUS_FAILED = 'failed';
const STATUS_ACTIVE = 'active';

const INITIAL_PROGRESS = 0;

type JobStatus = 'waiting' | 'active' | 'completed' | 'failed';

type StatusConfig = {
  label: string;
  Icon: React.ElementType;
};

const STATUS_CONFIG: Record<JobStatus, StatusConfig> = {
  waiting: { label: 'В очереди', Icon: HourglassEmptyIcon },
  active: { label: 'Генерируется', Icon: SyncIcon },
  completed: { label: 'Готово', Icon: CheckCircleIcon },
  failed: { label: 'Ошибка', Icon: ErrorIcon },
};

const isJobStatus = (value: string): value is JobStatus => {
  return value in STATUS_CONFIG;
};

const toInitialStatusDto = (job: ReportJobDto): ReportStatusDto => {
  return { ...job, progress: INITIAL_PROGRESS };
};

export type ReportJobRowProps = {
  job: ReportJobDto;
  requestedByName: string;
};

export const ReportJobRow = ({ job, requestedByName }: ReportJobRowProps) => {
  const { data } = useReportStatus(job.jobId, toInitialStatusDto(job));
  const { download, isLoading: isDownloading } = useDownloadReport();

  const statusKey = data?.status && isJobStatus(data.status) ? data.status : 'waiting';
  const progress = data?.progress ?? INITIAL_PROGRESS;
  const config = STATUS_CONFIG[statusKey];
  const isActive = statusKey === STATUS_ACTIVE;
  const isCompleted = statusKey === STATUS_COMPLETED;
  const isFailed = statusKey === STATUS_FAILED;
  const isTerminal = isCompleted || isFailed;

  const handleDownload = () => {
    void download(job.jobId);
  };

  return (
    <FixedHeightTableRow>
      <TableCell>
        <Stack direction={'row'} alignItems={'center'} gap={0.75}>
          {isActive ? (
            <SpinningStatusIcon as={config.Icon} $status={statusKey} />
          ) : (
            <StatusIcon as={config.Icon} $status={statusKey} />
          )}
          <StatusLabel variant={'body2'} $status={statusKey}>
            {config.label}
          </StatusLabel>
        </Stack>
      </TableCell>

      <TableCell>
        <JobIdLabel variant={'body2'}>{job.jobId}</JobIdLabel>
      </TableCell>

      <TableCell>
        {job.format && (
          <FormatChip label={job.format.toUpperCase()} size={'small'} variant={'outlined'} $format={job.format} />
        )}
      </TableCell>

      <TableCell>
        <Typography variant={'body2'} color={'text.secondary'} noWrap>
          {requestedByName}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant={'body2'} color={'text.secondary'} noWrap>
          {formatDate(new Date(job.createdAt).getTime())}
        </Typography>
      </TableCell>

      <TableCell>
        {!isTerminal && (
          <ProgressRow>
            <Typography variant={'caption'} color={'text.secondary'} noWrap>
              {`${progress}%`}
            </Typography>
            <ProgressBar variant={'determinate'} value={progress} color={isActive ? 'warning' : 'primary'} />
          </ProgressRow>
        )}
        {isCompleted && (
          <Typography variant={'body2'} color={'text.secondary'}>
            100%
          </Typography>
        )}
      </TableCell>

      <TableCell align={'right'}>
        {isCompleted && (
          <Button
            size={'small'}
            variant={'contained'}
            startIcon={<DownloadIcon />}
            loading={isDownloading}
            onClick={handleDownload}
          >
            Скачать
          </Button>
        )}
        {isFailed && (
          <Typography variant={'caption'} color={'error'}>
            Ошибка генерации
          </Typography>
        )}
      </TableCell>
    </FixedHeightTableRow>
  );
};

const TABLE_ROW_HEIGHT = 48;

const FixedHeightTableRow = styled(TableRow)({
  height: TABLE_ROW_HEIGHT,
  '& .MuiTableCell-root': {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const StatusIcon = styled(HourglassEmptyIcon, {
  shouldForwardProp: (prop) => prop !== '$status',
})<{ $status: JobStatus }>(({ theme, $status }) => {
  const colorByStatus: Record<JobStatus, string> = {
    waiting: theme.palette.text.secondary,
    active: theme.palette.warning.main,
    completed: theme.palette.success.main,
    failed: theme.palette.error.main,
  };
  return {
    fontSize: 16,
    color: colorByStatus[$status],
    flexShrink: 0,
  };
});

const SpinningStatusIcon = styled(StatusIcon)({
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  animation: 'spin 1.2s linear infinite',
});

const StatusLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$status',
})<{ $status: JobStatus }>(({ theme, $status }) => {
  const colorByStatus: Record<JobStatus, string> = {
    waiting: theme.palette.text.secondary,
    active: theme.palette.warning.main,
    completed: theme.palette.success.main,
    failed: theme.palette.error.main,
  };
  return {
    fontWeight: 500,
    color: colorByStatus[$status],
  };
});

const JobIdLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: 'monospace',
}));

const ProgressRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ProgressBar = styled(LinearProgress)({
  flex: 1,
  minWidth: 60,
});

const FormatChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== '$format',
})<{ $format: ReportJobDtoFormat }>(({ theme, $format }) => ({
  fontWeight: 600,
  fontSize: 11,
  height: 20,
  color: $format === ReportJobDtoFormat.pdf ? theme.palette.error.main : theme.palette.primary.main,
  borderColor: $format === ReportJobDtoFormat.pdf ? theme.palette.error.main : theme.palette.primary.main,
  '& .MuiChip-label': { paddingLeft: 6, paddingRight: 6 },
}));
