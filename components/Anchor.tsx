import React from 'react';
import { styled } from '@mui/material/styles';
import { teal } from '@mui/material/colors';

import { modeSensitive } from '@/lib/theme';

const StyledAnchor = styled('a')(({ theme }) => ({
  color: modeSensitive(theme, theme.palette.text.primary, teal[300]),
  textDecoration: modeSensitive(theme, 'underline', 'unset'),
  '&:hover': {
    cursor: 'pointer',
    color: modeSensitive(theme, teal[600], teal[200]),
    fontWeight: 500,
  },
}));

type Props = {
  children: React.ReactNode;
};

const Anchor: React.FC<Props> = ({ children, ...rest }) => (
  <StyledAnchor {...rest}>{children}</StyledAnchor>
);

export default Anchor;
