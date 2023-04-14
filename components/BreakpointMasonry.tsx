import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Masonry from 'react-masonry-css';

const PREFIX = 'BreakpointMasonry';
const classes = {
  masonryGrid: `${PREFIX}-masonry-grid`,
  masonryItem: `${PREFIX}-masonry-item`,
};

const StyledMasonry = styled(Masonry)(({ theme }) => ({
  [`&.${classes.masonryGrid}`]: {
    display: 'flex',
  },
  [`& .${classes.masonryItem} > div`]: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

type Props = {
  children: React.ReactNode;
};

// referred to from: https://github.com/mui-org/material-ui/issues/17000#issuecomment-639319327
const BreakpointMasonry: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  const { xl, lg, md, sm, xs } = theme.breakpoints.values;

  const breakpointCols = {
    default: 3,
    [xl]: 3,
    [lg]: 3,
    [md]: 2,
    [sm]: 1,
    [xs]: 1,
  };

  return (
    <StyledMasonry
      breakpointCols={breakpointCols}
      className={classes.masonryGrid}
      columnClassName={classes.masonryItem}
    >
      {children}
    </StyledMasonry>
  );
};

export default BreakpointMasonry;
