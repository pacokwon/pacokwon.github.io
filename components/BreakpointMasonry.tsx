import React from 'react';
import {
  makeStyles,
  createStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import Masonry from 'react-masonry-css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    masonryGrid: {
      display: 'flex',
    },
    masonryItem: {
      '& > div': {
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
  })
);

// referred to from: https://github.com/mui-org/material-ui/issues/17000#issuecomment-639319327
const BreakpointMasonry: React.FC = ({ children }) => {
  const classes = useStyles();
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
    <Masonry
      breakpointCols={breakpointCols}
      className={classes.masonryGrid}
      columnClassName={classes.masonryItem}
    >
      {children}
    </Masonry>
  );
};

export default BreakpointMasonry;
