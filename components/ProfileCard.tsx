import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import NextLink from 'next/link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';
import teal from '@material-ui/core/colors/teal';
import background from '@/public/image/profile-background.png';
import profile from '@/data/profile.json';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 900,
      margin: '0 auto',
    },
    mediaContainer: {
      position: 'relative',
      marginBottom: '50px',
    },
    background: {
      width: '100%',
      objectFit: 'cover',
      [theme.breakpoints.down('sm')]: {
        height: '160px',
      },
    },
    profileDiv: {
      position: 'absolute',
      // we want padding, but we also want to keep the content height as it is
      boxSizing: 'content-box',
      // if we want colored borders, we can set the background color of this div
      backgroundColor: 'white',
      padding: '5px',
      borderRadius: '50%',
      [theme.breakpoints.down('sm')]: {
        // image width and height are 60px here
        height: '120px',
        top: 'calc(100% - 90px)',
        left: 'calc(50% - 60px)',
      },
      [theme.breakpoints.up('sm')]: {
        // image width and height are 160px here
        height: '160px',
        top: 'calc(100% - 120px)',
        left: 'calc(50% - 80px)',
      },
    },
    profileImg: {
      borderRadius: '50%',
      [theme.breakpoints.down('sm')]: {
        // image width and height are 60px here
        height: '120px',
      },
      [theme.breakpoints.up('sm')]: {
        // image width and height are 160px here
        height: '160px',
      },
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    description: {
      marginTop: '16px',
    },
    action: {
      display: 'flex',
      justifyContent: 'center',
    },
    nickname: {
      color: teal[400],
    },
    github: {
      color: '#211F1F',
    },
    email: {
      color: '#EA4335',
    },
  })
);

const ProfileCard: React.FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div className={classes.mediaContainer}>
        <img
          className={classes.background}
          src={background}
          alt="Profile Background"
        />
        <div className={classes.profileDiv}>
          <img
            className={classes.profileImg}
            src={profile.image}
            alt="Profile Image"
          />
        </div>
      </div>
      <CardContent className={classes.content}>
        <Typography variant="h4">{profile.name}</Typography>
        <Typography
          classes={{ colorPrimary: classes.nickname }}
          color="primary"
          variant="subtitle2"
          gutterBottom
        >
          {profile.nickname}
        </Typography>
        <Typography
          className={classes.description}
          align="center"
          variant="body1"
        >
          {profile.description.map((text, i) => (
            <React.Fragment key={i}>
              {text}
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </CardContent>
      <CardActions className={classes.action} disableSpacing>
        <NextLink href={profile.github} passHref>
          <IconButton
            color="primary"
            classes={{ colorPrimary: classes.github }}
          >
            <GitHubIcon />
          </IconButton>
        </NextLink>
        <NextLink href={`mailto:${profile.email}`} passHref>
          <IconButton color="primary" classes={{ colorPrimary: classes.email }}>
            <EmailIcon />
          </IconButton>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
