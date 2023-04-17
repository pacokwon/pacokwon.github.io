import React, { useContext } from 'react';
import NextLink from 'next/link';

import { LinkProps as MuiLinkProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiAppBar from '@mui/material/AppBar';
import { Link as MuiLink } from '@mui/material';
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

const Link: React.FC<MuiLinkProps> = props => (
  <MuiLink component={NextLink} {...props} />
);

type SectionLinkProps = {
  href: string;
  children: React.ReactNode;
};
const SectionLink: React.FC<SectionLinkProps> = ({ href, children }) => {
  const theme = useTheme();

  return (
    <MuiLink
      sx={{
        marginRight: theme.spacing(2),
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
      component={NextLink}
      href={href}
    >
      <Typography variant="body1">{children}</Typography>
    </MuiLink>
  );
};

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
  '&.MuiAppBar-root': {
    backgroundImage: 'unset',
  },
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
      <AppBar color="primary">
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
                <SectionLink href="/bio">Bio</SectionLink>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <SectionLink href="/posts">Posts</SectionLink>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <SectionLink href="/links">Links</SectionLink>
              </MenuItem>
            </Menu>
          </Box>

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
            href="/"
            component={NextLink}
          >
            Paco Kwon
          </MuiLink>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            <SectionLink href="/bio">Bio</SectionLink>
            <SectionLink href="/posts">Posts</SectionLink>
            <SectionLink href="/links">Links</SectionLink>
            {isDev && <SectionLink href="/editor">Editor</SectionLink>}
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
      <Toolbar />
    </Root>
  );
};

export default NavBar;
