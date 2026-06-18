import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { forwardRef } from 'react';
import * as React from 'react';

export type ButtonProps = LoadingButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  return <LoadingButton ref={ref} {...props} />;
});
