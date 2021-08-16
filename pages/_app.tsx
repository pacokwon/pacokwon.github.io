import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';

const App: React.FC<AppProps> = props => {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Next.js Page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  );
};

export default App;
