import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { PostData } from '@/lib/posts';

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
    },
    title: {
      fontWeight: 'bold',
    },
    content: {
      color: teal[400],
      fontWeight: 'bold',
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
      <CardHeader classes={{ title: classes.title }} title={post.title} />
      <CardContent>
        <span className={classes.content}>{post.date}</span>
      </CardContent>
    </Card>
  );
};

export default PostCard;
