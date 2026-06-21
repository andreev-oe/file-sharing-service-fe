import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { ReportJobDto } from '@/api/generated/types';

import { ReportJobRow } from '../report-job-row';

type ColumnConfig = {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
};

export type ReportJobsTableProps = {
  jobs: ReportJobDto[];
  userNameById: Record<string, string>;
  onJobUpdate: (job: ReportJobDto) => void;
  isUsersLoading: boolean;
};

const COLUMNS: ColumnConfig[] = [
  { key: 'status', label: 'Статус', width: 160 },
  { key: 'jobId', label: 'ID задачи' },
  { key: 'format', label: 'Формат', width: 80 },
  { key: 'requestedBy', label: 'Инициатор', width: 180 },
  { key: 'createdAt', label: 'Создана', width: 200 },
  { key: 'progress', label: 'Прогресс' },
  { key: 'actions', label: '', width: 140, align: 'right' },
];

export const ReportJobsTable = ({ jobs, userNameById, onJobUpdate, isUsersLoading }: ReportJobsTableProps) => {
  return (
    <FixedLayoutTable size={'small'}>
      <TableHead>
        <TableRow>
          {COLUMNS.map((column) => (
            <TableCell key={column.key} width={column.width} align={column.align}>
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <ReportJobRow
            key={job.jobId}
            job={job}
            requestedByName={userNameById[job.requestedById] ?? job.requestedById}
            onJobUpdate={onJobUpdate}
            isInitiatorLoading={isUsersLoading}
          />
        ))}
      </TableBody>
    </FixedLayoutTable>
  );
};

const FixedLayoutTable = styled(Table)({
  tableLayout: 'fixed',
  width: '100%',
});
