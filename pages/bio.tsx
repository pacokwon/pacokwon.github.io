import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import bio from '@/data/bio.json';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        marginBottom: theme.spacing(4),
      },
    },
    bioRow: {
      display: 'flex',
      marginBottom: theme.spacing(2),
      '& > .duration': {
        flex: '0 0 10rem',
        fontStyle: 'italic',
      },
      '& > .description': {
        flexGrow: 1,
        fontWeight: '500',
      },
    },
  })
);

const Index: React.FC = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant="h4">Bio</Typography>
      <div>
        {bio.timeline.map(({ duration, description }, idx) => (
          <div key={idx} className={classes.bioRow}>
            <Typography className="duration" variant="body1">
              {duration.start} ~ {duration.end}
            </Typography>
            <Typography className="description" variant="body1">
              {description}
            </Typography>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Index;
