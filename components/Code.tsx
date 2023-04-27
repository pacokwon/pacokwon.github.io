import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { teal, grey } from '@mui/material/colors';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { modeSensitive } from '@/lib/theme';

const StyledCode = styled('code')(({ theme }) => ({
  color: teal[400],
  background: modeSensitive(theme, grey[50], grey[900]),
  borderRadius: '4px',
  fontWeight: 'bold',
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
  '&.MuiIconButton-colorPrimary': {
    color: modeSensitive(theme, grey[500], grey[600]),
  },
}));

type Props = React.HTMLAttributes<HTMLElement>;

// https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html
const CodeBlock: React.FC<Props> = ({ children, className }) => {
  const codeRef = useRef(null);
  const [hasClipboard, setHasClipboard] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async () => {
    if (typeof window !== 'undefined') {
      if (!hasClipboard) return;

      await navigator.clipboard.writeText(codeRef.current.innerText);

      setIsOpen(true);
    }
  };

  const handleHide = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setHasClipboard(
      navigator.clipboard !== undefined || navigator.clipboard !== null
    );
  }, []);

  return (
    <CodeBlockWrapper>
      <code ref={codeRef} className={className}>
        {children}
      </code>
      {hasClipboard && (
        <Tooltip title="Copied!" open={isOpen}>
          <CopyButton
            color="primary"
            onClick={handleCopy}
            onMouseLeave={handleHide}
          >
            <ContentCopyIcon fontSize="small" />
          </CopyButton>
        </Tooltip>
      )}
    </CodeBlockWrapper>
  );
};

const CodeBlockWrapper = styled('div')(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 400,
  marginBottom: theme.spacing(1.5),
  border: `1px solid ${modeSensitive(theme, grey[200], grey[900])}`,
  position: 'relative',
  '& button': {
    position: 'absolute',
    top: '5px',
    right: '5px',
  },
  '& code.hljs': {
    background: 'var(--background-color)',
  },
}));

const Code: React.FC<Props> = ({ children, className }) => {
  // is this element a code block wrapped inside a <pre> tag?
  // then it will have the 'hljs' class
  const isCodeBlock = className?.includes('hljs') ?? false;

  if (isCodeBlock)
    return <CodeBlock className={className}>{children}</CodeBlock>;

  return <StyledCode className={className}>{children}</StyledCode>;
};

export default Code;
