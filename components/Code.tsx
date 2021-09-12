import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import grey from '@material-ui/core/colors/grey';
import clsx from 'clsx';

type Props = React.HTMLAttributes<HTMLElement>;

const useStyles = makeStyles(() =>
  createStyles({
    block: {
      borderRadius: '8px',
      fontWeight: 600,
    },
    inline: {
      color: teal[400],
      background: grey[50],
      borderRadius: '4px',
      fontWeight: 'bold',
    },
  })
);

const Code: React.FC<Props> = ({ children, className }) => {
  const classes = useStyles();

  // is this element a code block wrapped inside a <pre> tag?
  // then it will have the 'hljs' class
  const isCodeBlock = className?.includes('hljs') ?? false;

  const classMap = {
    [classes.block]: isCodeBlock,
    [classes.inline]: !isCodeBlock,
  };

  const root = clsx(classMap, className);
  return <code className={root}>{children}</code>;
};

export default Code;
