import React from 'react';
import NextLink from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(4),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    appbar: {
      boxShadow: 'none',
      backgroundColor: theme.palette.background.default,
      color: 'black',
    },
    toolbar: {
      padding: `0 ${theme.spacing(4)}px`,
      '& > *': {
        marginRight: theme.spacing(2),
      },
    },
    leftmost: {
      marginRight: theme.spacing(4),
    },
  })
);

const NavBar: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" classes={{ colorPrimary: classes.appbar }}>
        <Toolbar className={classes.toolbar}>
          <NextLink href="/" passHref>
            <MuiLink className={classes.leftmost} color="inherit">
              <Typography variant="h5">Paco Kwon</Typography>
            </MuiLink>
          </NextLink>
          <NextLink href="/posts" passHref>
            <MuiLink color="inherit">
              <Typography variant="body1">Posts</Typography>
            </MuiLink>
          </NextLink>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
