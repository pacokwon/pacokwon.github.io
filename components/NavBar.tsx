import React from 'react';
import NextLink from 'next/link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import MuiLink from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { teal } from '@mui/material/colors';

type LinkProps = {
  href: string;
};
const Link: React.FC<LinkProps> = ({ children, href }) => (
  <NextLink href={href} passHref>
    <MuiLink sx={{ mr: 2 }} color="inherit">
      {children}
    </MuiLink>
  </NextLink>
);

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginBottom: theme.spacing(4),
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  '&.MuiAppBar-colorPrimary': {
    boxShadow: 'none',
    backgroundColor: theme.palette.grey[50],
    color: 'black',
  },
}));

const NavBar: React.FC = () => {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <Root>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ px: 4 }} disableGutters={true}>
          <NextLink href="/" passHref>
            <MuiLink
              sx={{
                marginRight: 4,
                '.MuiLink-underlineHover': {
                  color: teal[400],
                },
              }}
            >
              <Typography
                sx={{
                  '&.MuiTypography-root': {
                    color: teal[400],
                    fontWeight: 'bold',
                  },
                }}
                variant="h5"
              >
                Paco Kwon
              </Typography>
            </MuiLink>
          </NextLink>
          <Link href="/bio">
            <Typography variant="body1">Bio</Typography>
          </Link>
          <Link href="/posts">
            <Typography variant="body1">Posts</Typography>
          </Link>
          {isDev && (
            <Link href="/editor">
              <Typography variant="body1">Editor</Typography>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Root>
  );
};

export default NavBar;
