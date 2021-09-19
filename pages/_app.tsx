import React, { useEffect } from 'react';

import { CacheProvider, EmotionCache } from '@emotion/react';

import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Layout from '@/components/Layout';

import createEmotionCache from '@/lib/createEmotionCache';
import theme from '@/lib/theme';

const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

const App: React.FC<Props> = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
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
    <CacheProvider value={emotionCache}>
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
    </CacheProvider>
  );
};

export default App;
