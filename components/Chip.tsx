import { styled } from '@mui/material/styles';
import MuiChip from '@mui/material/Chip';
import { teal } from '@mui/material/colors';

import { modeSensitive } from '@/lib/theme';

const Chip = styled(MuiChip)(({ theme }) => ({
  '&.MuiChip-colorPrimary': {
    color: 'white',
    background: modeSensitive(theme, teal[300], teal[500]),
    fontWeight: 500,
  },
}));

export default Chip;
