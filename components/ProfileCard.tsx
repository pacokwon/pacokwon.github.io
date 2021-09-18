import React from 'react';
import NextLink from 'next/link';
import MuiCard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import MuiCardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import { teal } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import background from '@/public/image/profile-background.png';
import profile from '@/data/profile.json';

const Card = styled(MuiCard)({
  maxWidth: 900,
  margin: '0 auto',
});

const CardContent = styled(MuiCardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Media = styled('div')(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(6),
}));

const BackgroundImg = styled('img')(({ theme }) => ({
  width: '100%',
  objectFit: 'cover',
  [theme.breakpoints.down('sm')]: {
    height: '160px',
  },
}));

const Profile = styled('div')(({ theme }) => ({
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
}));

const ProfileImg = styled('img')(({ theme }) => ({
  borderRadius: '50%',
  [theme.breakpoints.down('sm')]: {
    // image width and height are 60px here
    height: '120px',
  },
  [theme.breakpoints.up('sm')]: {
    // image width and height are 160px here
    height: '160px',
  },
}));

const ProfileCard: React.FC = () => {
  return (
    <Card>
      <Media>
        <BackgroundImg src={background} alt="Profile Background" />
        <Profile>
          <ProfileImg src={profile.image} alt="Profile Image" />
        </Profile>
      </Media>
      <CardContent>
        <Typography variant="h4">{profile.name}</Typography>
        <Typography
          color="primary"
          variant="subtitle2"
          gutterBottom
          sx={{
            '&.MuiTypography-root': {
              color: teal[400],
            },
          }}
        >
          {profile.nickname}
        </Typography>
        <Typography sx={{ mt: 2 }} align="center" variant="body1">
          {profile.description.map((text, i) => (
            <React.Fragment key={i}>
              {text}
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <NextLink href={profile.github} passHref>
          <IconButton
            color="primary"
            sx={{
              '&.MuiIconButton-colorPrimary': {
                color: '#211F1F',
              },
            }}
          >
            <GitHubIcon />
          </IconButton>
        </NextLink>
        <NextLink href={`mailto:${profile.email}`} passHref>
          <IconButton
            color="primary"
            sx={{
              '&.MuiIconButton-colorPrimary': {
                color: '#EA4335',
              },
            }}
          >
            <EmailIcon />
          </IconButton>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
