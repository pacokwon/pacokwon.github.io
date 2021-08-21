import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Image from 'next/image';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() =>
  createStyles({
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
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  })
);

const ProfileCard: React.FC = () => {
  const classes = useStyles();

  return (
    <Card>
      <div className={classes.mediaContainer}>
        <Image
          src="/image/profile-background.png"
          alt="Profile Background"
          width={3}
          height={1}
          layout="responsive"
          objectFit="cover"
        />
        <div className={classes.profileDiv}>
          <Image
            className={classes.profileImg}
            src="https://github.com/pacokwon.png"
            alt="Profile"
            width={160}
            height={160}
          />
        </div>
      </div>
      <CardContent className={classes.contentContainer}>
        <Typography variant="h4">Haechan Kwon</Typography>
        <Typography variant="subtitle2">pacokwon</Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
