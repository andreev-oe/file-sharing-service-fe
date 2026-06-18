import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { ComponentProps, forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Anchor = styled(RouterLink)({});

export interface LinkComposedProps extends ComponentProps<typeof Anchor> {}

export const LinkComposed = forwardRef<HTMLAnchorElement, LinkComposedProps>(function LinkComposed(props, ref) {
  return <Anchor ref={ref} {...props} />;
});

export type LinkProps = LinkComposedProps & MuiLinkProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  return <MuiLink component={LinkComposed} ref={ref} {...props} />;
});
