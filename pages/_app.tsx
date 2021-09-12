import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Layout from '@/components/Layout';

const theme = createTheme({
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
