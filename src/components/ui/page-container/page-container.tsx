import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';

import { spacing } from '@/utils/styled.utils';

export const PageContainer = styled(Container)`
  padding-top: ${spacing(2)};
  padding-bottom: ${spacing(2)};
  flex: 1 1 0;
`;
