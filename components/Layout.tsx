import React from 'react';
import Box from '@mui/material/Box';
import NavBar from './NavBar';

const Layout: React.FC = ({ children }) => {
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
