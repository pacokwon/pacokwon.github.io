import React, { useEffect } from 'react';

import { CacheProvider, EmotionCache } from '@emotion/react';

import { AppProps } from 'next/app';
import Head from 'next/head';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Layout from '@/components/Layout';

import createEmotionCache from '@/lib/createEmotionCache';
import { createBlogTheme } from '@/lib/theme';
import ColorModeContext from '@/lib/ColorModeContext';

import '@/css/index.css';

const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

const App: React.FC<Props> = props => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        document.querySelector('#hljs-dark');
        setMode(prevMode => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light';
          return nextMode;
        });
      },
    }),
    []
  );

  const theme = React.useMemo(() => createBlogTheme(mode), [mode]);

  useEffect(() => {
    const opposite = mode === 'dark' ? 'light' : 'dark';

    document
      .querySelector(`#hljs-${opposite}`)
      .setAttribute('disabled', 'disabled');

    document.querySelector(`#hljs-${mode}`).removeAttribute('disabled');

    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Paco Kwon</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
};

export default App;
