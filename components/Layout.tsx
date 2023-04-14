import React from 'react';
import Box from '@mui/material/Box';
import NavBar from './NavBar';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>
        <Box mb={5}>{children}</Box>
      </main>
    </>
  );
};

export default Layout;
