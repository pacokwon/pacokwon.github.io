import React from 'react';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const Index: React.FC = () => {
  return (
    <Container>
      <Editor />
    </Container>
  );
};

export default Index;
