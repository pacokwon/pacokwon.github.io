import { styled } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';

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
  function injectScript() {
    const script = document.createElement('script');
    const anchor = document.getElementById('utterances-comments');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('repo', 'pacokwon/pacokwon.github.io');
    script.setAttribute('issue-term', 'title');
    script.setAttribute('theme', 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    anchor.appendChild(script);
  }

  useEffect(() => {
    injectScript();
  }, []);

  return <Div id="utterances-comments" />;
};

export default Comments;
