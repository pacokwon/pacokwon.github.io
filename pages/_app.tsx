import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import Layout from '@/components/Layout';
import { breakpointValues } from '@/lib/breakpoints';

const breakpoints = createBreakpoints(breakpointValues);

const theme = createTheme({
  breakpoints,
  overrides: {
    MuiCssBaseline: {
      '@global': {
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
});

const App: React.FC<AppProps> = props => {
  const { Component, pageProps } = props;
  const router = useRouter();

  const handleRouteChange = (url: string) => {
    window.gtag('config', 'G-688XJFWYJL', {
      page_path: url,
    });
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Paco Kwon</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
};

export default App;
