import React from 'react';
import { styled } from '@mui/material/styles';
import { teal } from '@mui/material/colors';

const StyledAnchor = styled('a')({
  color: 'black',
  textDecoration: 'underline',
  '&:hover': {
    cursor: 'pointer',
    color: teal[600],
    fontWeight: 500,
  },
});

const Anchor: React.FC = ({ children }) => (
  <StyledAnchor>{children}</StyledAnchor>
);

export default Anchor;
