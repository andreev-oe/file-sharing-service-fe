import AssessmentIcon from '@mui/icons-material/Assessment';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import { Head } from '@/components/seo';
import { useUsers } from '@/features/users/hooks/use-users';

import { useReportHistory } from '../../hooks/use-report-history';
import { CreateReportForm } from '../create-report-form';
import { ReportJobsTable } from '../report-jobs-table';

export const ReportsPage = () => {
  const { jobs, addJob, updateJob } = useReportHistory();
  const { data: users, isPending: isUsersPending } = useUsers();
  const userNameById = useMemo(() => {
    return Object.fromEntries(users.map((user) => [user.id, user.name]));
  }, [users]);

  return (
    <>
      <Head title={'Отчёты'} />
      <ReportsPageRoot>
        <PageTopSection>
          <Typography variant={'h5'} mb={2}>
            Отчёты
          </Typography>
          <CreateReportForm onJobCreated={addJob} />
        </PageTopSection>

        <HistorySection>
          <Stack direction={'row'} alignItems={'center'} gap={1} mb={1.5}>
            <HistoryIcon />
            <Typography variant={'h6'}>История задач</Typography>
          </Stack>
          <HistoryDivider />

          {jobs.length === 0 ? (
            <Typography variant={'body2'} color={'text.secondary'}>
              Задачи появятся здесь после создания отчёта
            </Typography>
          ) : (
            <ReportJobsTable
              jobs={jobs}
              userNameById={userNameById}
              onJobUpdate={updateJob}
              isUsersLoading={isUsersPending}
            />
          )}
        </HistorySection>
      </ReportsPageRoot>
    </>
  );
};

const ReportsPageRoot = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  gap: theme.spacing(3),
}));

const PageTopSection = styled(Box)({
  flexShrink: 0,
});

const HistorySection = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const HistoryDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HistoryIcon = styled(AssessmentIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 22,
}));
