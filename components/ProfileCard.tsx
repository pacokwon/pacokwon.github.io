import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import NextLink from 'next/link';
import Image from 'next/image';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';

import profile from '@/data/profile.json';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 900,
      margin: '0 auto',
    },
    mediaContainer: {
      position: 'relative',
      marginBottom: '50px',
    },
    profileDiv: {
      position: 'absolute',
      // a little more higher than the middle
      top: 'calc(100% - 120px)',
      // absolute middle
      left: 'calc(50% - 80px)',
      // line-height and font-size make the height a little larger
      height: '160px',
      // we want padding, but we also want to keep the content height as it is
      boxSizing: 'content-box',
      // if we want colored borders, we can set the background color of this div
      backgroundColor: 'white',
      padding: '5px',
      borderRadius: '50%',
    },
    profileImg: {
      borderRadius: '50%',
      border: '1px solid black',
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
        <Image
          src={profile.background}
          alt="Profile Background"
          width={3}
          height={1}
          layout="responsive"
          objectFit="cover"
        />
        <div className={classes.profileDiv}>
          <Image
            className={classes.profileImg}
            src={profile.image}
            alt="Profile"
            width={160}
            height={160}
          />
        </div>
      </div>
      <CardContent className={classes.content}>
        <Typography variant="h4">{profile.name}</Typography>
        <Typography variant="subtitle2" gutterBottom>
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
