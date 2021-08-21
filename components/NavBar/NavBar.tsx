import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
    title: {
      flexGrow: 1,
    },
    appbar: {
      boxShadow: 'none',
      backgroundColor: theme.palette.background.default,
      color: 'black',
    },
  })
);

const NavBar: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" classes={{ colorPrimary: classes.appbar }}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" align="center">
            Blog of Paco Kwon
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
