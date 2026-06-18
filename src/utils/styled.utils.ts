import { Theme } from '@mui/material';

export const spacing =
  (value: string | number) =>
  ({ theme }: { theme: Theme }) =>
    theme.spacing(value);
