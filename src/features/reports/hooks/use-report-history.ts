import { useState } from 'react';

import type { ReportJobDto } from '@/api/generated/types';

const REPORT_HISTORY_KEY = 'report_job_history';
const MAX_HISTORY_SIZE = 10;

const loadHistory = (): ReportJobDto[] => {
  try {
    const stored = localStorage.getItem(REPORT_HISTORY_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as unknown[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }
    if (typeof parsed[0] === 'string') {
      return [];
    }
    return parsed as ReportJobDto[];
  } catch {
    return [];
  }
};

export const useReportHistory = () => {
  const [jobs, setJobs] = useState<ReportJobDto[]>(loadHistory);

  const addJob = (job: ReportJobDto) => {
    setJobs((previous) => {
      const updated = [job, ...previous.filter((existing) => existing.jobId !== job.jobId)].slice(0, MAX_HISTORY_SIZE);
      localStorage.setItem(REPORT_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { jobs, addJob };
};
