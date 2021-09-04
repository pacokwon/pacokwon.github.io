import React from 'react';
import { AppProps } from 'next/app';
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
      },
    },
  },
});

const App: React.FC<AppProps> = props => {
  const { Component, pageProps } = props;

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
