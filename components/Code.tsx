import React from 'react';
import { styled } from '@mui/material/styles';
import { teal, grey } from '@mui/material/colors';

import { modeSensitive } from '@/lib/theme';

interface StyledCodeProps {
  type: 'inline' | 'block';
}

const StyledCode = styled('code')<StyledCodeProps>(({ theme, type }) =>
  type === 'block'
    ? {
        borderRadius: '8px',
        fontWeight: 600,
      }
    : {
        color: teal[400],
        background: modeSensitive(theme, grey[50], grey[900]),
        borderRadius: '4px',
        fontWeight: 'bold',
      }
);

type Props = React.HTMLAttributes<HTMLElement>;
const Code: React.FC<Props> = ({ children, className }) => {
  // is this element a code block wrapped inside a <pre> tag?
  // then it will have the 'hljs' class
  const isCodeBlock = className?.includes('hljs') ?? false;

  return (
    <StyledCode type={isCodeBlock ? 'block' : 'inline'} className={className}>
      {children}
    </StyledCode>
  );
};

export default Code;
