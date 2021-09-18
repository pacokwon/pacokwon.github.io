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
    title: {
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

// TODO: tag support. load support
const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const ref = useRef<ToastEditor>(null);
  const classes = useStyles();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onClick = () => {
    if (ref.current === null || title === '') return;

    const meta = `---\ntitle: '${title}'\n---`;
    const content = ref.current.getInstance().getMarkdown();

    const file = `data:,${meta}${content}`;

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `${date}-${title.toLowerCase().split(' ').join('-')}.md`;

    const atag = document.createElement('a');
    atag.href = file;
    atag.download = filename;
    atag.click();
  };

  return (
    <div className={classes.root}>
      <TextField
        className={classes.title}
        label="Title"
        value={title}
        onChange={handleTitleChange}
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
