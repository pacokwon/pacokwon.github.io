import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ProfileCard from '@/components/ProfileCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        marginBottom: theme.spacing(4),
      },
    },
  })
);

const Index: React.FC = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <ProfileCard />
    </Container>
  );
};

export default Index;
