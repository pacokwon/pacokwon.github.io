import React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import bio from '@/data/bio.json';

const RootContainer = styled(Container)(({ theme }) => ({
  '& > *': {
    marginBottom: theme.spacing(4),
  },
}));

const BioRow = styled('div')(({ theme }) => ({
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
}));

const Index: React.FC = () => {
  return (
    <RootContainer>
      <Typography sx={{ mb: 2 }} variant="h4">
        Bio
      </Typography>
      <div>
        {bio.timeline.map(({ duration, description }, idx) => (
          <BioRow key={idx}>
            <Typography className="duration" variant="body1">
              {duration.start} ~ {duration.end}
            </Typography>
            <Typography className="description" variant="body1">
              {description}
            </Typography>
          </BioRow>
        ))}
      </div>
    </RootContainer>
  );
};

export default Index;
