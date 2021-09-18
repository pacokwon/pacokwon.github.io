import React, { useState, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
    filename: {
      width: '100%',
    },
    editor: {
      marginBottom: theme.spacing(2),
    },
    submit: {
      alignSelf: 'flex-end',
    },
  })
);

// TODO: load support
const Editor: React.FC = () => {
  const [filename, setFilename] = useState<string>('');
  const ref = useRef<ToastEditor>(null);
  const classes = useStyles();

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
    <div className={classes.root}>
      <TextField
        className={classes.filename}
        label="Filename"
        value={filename}
        onChange={handleFilenameChange}
      />
      <ToastEditor ref={ref} usageStatistics={false} previewStyle="vertical" />
      <Button
        className={classes.submit}
        variant="contained"
        color="primary"
        onClick={onClick}
      >
        Save
      </Button>
    </div>
  );
};

export default Editor;
