import React from 'react';
import { useEffect } from 'react';

import { styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
  padding: theme.spacing(3, 5),
  '& .utterances': {
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 'unset',
    margin: 0,
  },
}));

const Comments: React.FC = () => {
  const theme = useTheme();

  function injectScript(mode: string) {
    const script = document.createElement('script');
    const anchor = document.getElementById('utterances-comments');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('repo', 'pacokwon/pacokwon.github.io');
    script.setAttribute('issue-term', 'title');
    script.setAttribute(
      'theme',
      mode === 'light' ? 'github-light' : 'github-dark'
    );
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    anchor.replaceChildren(script);
  }

  useEffect(() => {
    injectScript(theme.palette.mode);
  }, [theme.palette.mode]);

  return <Div id="utterances-comments" />;
};

export default Comments;
