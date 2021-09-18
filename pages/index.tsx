import React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import ProfileCard from '@/components/ProfileCard';

const RootContainer = styled(Container)(({ theme }) => ({
  '& > *': {
    marginBottom: theme.spacing(4),
  },
}));

const Index: React.FC = () => {
  return (
    <RootContainer>
      <ProfileCard />
    </RootContainer>
  );
};

export default Index;
