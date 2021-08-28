import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

type Props = React.HTMLAttributes<HTMLElement>;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      borderRadius: '8px',
    },
  })
);

const Code: React.FC<Props> = ({ children, className }) => {
  const classes = useStyles();
  const root = clsx(classes.root, className);
  return <code className={root}>{children}</code>;
};

export default Code;
