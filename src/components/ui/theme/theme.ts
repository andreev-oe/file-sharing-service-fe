import { createTheme } from '@mui/material';
import { amber } from '@mui/material/colors';
import { ruRU as coreRU } from '@mui/material/locale';

import { componentOverrides } from '@/components/ui/theme/overrides/component.overrides';

export const theme = createTheme(
  {
    palette: {
      primary: amber,
    },
    components: componentOverrides,
  },
  coreRU,
);
