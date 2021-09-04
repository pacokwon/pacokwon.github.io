import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import { PostData } from '@/lib/posts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
    },
    contentRoot: {
      paddingTop: theme.spacing(0),
    },
    headerTitle: {
      fontWeight: 'bold',
    },
    date: {
      fontWeight: 'bold',
      paddingLeft: theme.spacing(0.5),
    },
    tags: {
      display: 'flex',
      gap: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    chip: {
      background: teal[200],
    },
  })
);

interface Props extends React.HTMLAttributes<HTMLElement> {
  post: PostData;
}

const PostCard: React.FC<Props> = ({ post, className }) => {
  const router = useRouter();
  const classes = useStyles();

  const path = `/posts/${post.id}`;
  const navigate = () => router.push(path);

  const root = clsx(classes.root, className);

  return (
    <Card className={root} onClick={navigate}>
      <CardHeader classes={{ title: classes.headerTitle }} title={post.title} />
      <CardContent classes={{ root: classes.contentRoot }}>
        <span className={classes.date}>{post.date}</span>
        <div className={classes.tags}>
          {post.tags.map(tag => (
            <Chip
              classes={{ colorPrimary: classes.chip }}
              key={tag}
              color="primary"
              label={tag}
              size="small"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
