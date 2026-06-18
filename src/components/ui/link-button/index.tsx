import { Button, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

import { LinkComposed, LinkComposedProps } from '@/components/ui/link';

type LinkButtonProps = Omit<ButtonProps, 'component' | 'LinkComponent' | 'href'> & LinkComposedProps;

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(props, ref) {
  return <Button ref={ref} component={LinkComposed} {...props} />;
});
