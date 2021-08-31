import React from 'react';
import NextLink from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

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
    main: {
      color: teal[400],
      fontWeight: 'bold',
    },
    mainUnderline: {
      color: teal[400],
    },
    leftmost: {
      marginRight: theme.spacing(4),
    },
  })
);

type LinkProps = {
  href: string;
};
const Link: React.FC<LinkProps> = ({ children, href }) => {
  return (
    <NextLink href={href} passHref>
      <MuiLink color="inherit">{children}</MuiLink>
    </NextLink>
  );
};

const NavBar: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" classes={{ colorPrimary: classes.appbar }}>
        <Toolbar className={classes.toolbar}>
          <NextLink href="/" passHref>
            <MuiLink
              classes={{ underlineHover: classes.mainUnderline }}
              className={classes.leftmost}
              color="inherit"
            >
              <Typography
                classes={{ colorPrimary: classes.main }}
                color="primary"
                variant="h5"
              >
                Paco Kwon
              </Typography>
            </MuiLink>
          </NextLink>
          <Link href="/bio">
            <Typography variant="body1">Bio</Typography>
          </Link>
          <Link href="/posts">
            <Typography variant="body1">Posts</Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
