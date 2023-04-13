import React, { useContext } from 'react';
import NextLink from 'next/link';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiAppBar from '@mui/material/AppBar';
import MuiLink from '@mui/material/Link';
import MuiToolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';

import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { teal } from '@mui/material/colors';

import ColorModeContext from '@/lib/ColorModeContext';
import { modeSensitive } from '@/lib/theme';

type LinkProps = {
  href: string;
};
const Link: React.FC<LinkProps> = ({ children, href }) => (
  <NextLink href={href} passHref>
    <MuiLink sx={{ mr: 2 }} underline="hover" color="inherit">
      {children}
    </MuiLink>
  </NextLink>
);

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginBottom: theme.spacing(4),
}));

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  '&.MuiToolbar-root': {
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2),
    },
  },
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  '&.MuiAppBar-colorPrimary': {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));

const NavBar: React.FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const isDev = process.env.NODE_ENV === 'development';
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Root>
      <AppBar position="static" color="primary">
        <Toolbar disableGutters={true}>
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', sm: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href="/bio">
                  <Typography textAlign="center">Bio</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href="/posts">
                  <Typography textAlign="center">Posts</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href="/links">
                  <Typography textAlign="center">Links</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          <NextLink href="/" passHref>
            <MuiLink
              sx={{
                flexGrow: { xs: 1, sm: 0 },
                marginRight: { sm: 4 },
                marginLeft: { xs: 2 },
                '&.MuiLink-root, &.MuiLink-underlineHover': {
                  color: modeSensitive(theme, teal[400], teal[300]),
                  fontWeight: 'bold',
                },
              }}
              underline="hover"
              variant="h5"
            >
              Paco Kwon
            </MuiLink>
          </NextLink>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            <Link href="/bio">
              <Typography variant="body1">Bio</Typography>
            </Link>
            <Link href="/posts">
              <Typography variant="body1">Posts</Typography>
            </Link>
            <Link href="/links">
              <Typography variant="body1">Links</Typography>
            </Link>
            {isDev && (
              <Link href="/editor">
                <Typography variant="body1">Editor</Typography>
              </Link>
            )}
          </Box>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Root>
  );
};

export default NavBar;
