import React, { useState, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > *': {
    marginBottom: theme.spacing(2),
  },
}));

// TODO: load support
const Editor: React.FC = () => {
  const [filename, setFilename] = useState<string>('');
  const ref = useRef<ToastEditor>(null);

  const handleFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value);
  };

  const onClick = () => {
    if (ref.current === null || filename === '') return;

    const content = ref.current.getInstance().getMarkdown();
    const file = `data:,${content}`;

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const name = `${date}-${filename}.md`;

    const atag = document.createElement('a');
    atag.href = file;
    atag.download = name;
    atag.click();
  };

  return (
    <Root>
      <TextField
        variant="standard"
        label="Filename"
        value={filename}
        onChange={handleFilenameChange}
        sx={{ width: '100%', mb: 2 }}
      />
      <ToastEditor ref={ref} usageStatistics={false} previewStyle="vertical" />
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        sx={{ alignSelf: 'flex-end' }}
      >
        Save
      </Button>
    </Root>
  );
};

export default Editor;
