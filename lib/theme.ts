import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { breakpoints } from '@/lib/breakpoints';
import { Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: '400',
});

export const createBlogTheme = (mode: PaletteMode): Theme =>
  responsiveFontSizes(
    createTheme({
      typography: {
        fontFamily: [notoSansKr.style.fontFamily, 'Roboto'].join(','),
      },
      palette: {
        mode,
      },
      breakpoints,
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            '*': {
              padding: 0,
              margin: 0,
            },
            html: {
              overflowX: 'hidden',
            },
            body: {
              overflowX: 'hidden',
              position: 'relative',
              lineHeight: 1.6,
            },
            ':root': {
              '--fs-800': '3rem',
              '--fs-700': '2rem',
              '--fs-600': '1.5rem',
              '--fs-500': '1.25rem',
              '--fs-400': '1.125rem',
              '--fs-300': '1rem',
              '--fs-200': '0.8rem',
            },
          },
        },
      },
    })
  );

export const modeSensitive = <T>(theme: Theme, light: T, dark: T): T =>
  theme.palette.mode === 'light' ? light : dark;
