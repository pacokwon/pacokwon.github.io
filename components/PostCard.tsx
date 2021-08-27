import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { PostData } from '@/lib/posts';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyle = makeStyles((_: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
    },
  })
);

interface Props extends React.HTMLAttributes<HTMLElement> {
  post: PostData;
}

const PostCard: React.FC<Props> = ({ post, className }) => {
  const router = useRouter();
  const classes = useStyle();

  const path = `/posts/${post.id}`;
  const navigate = () => router.push(path);

  const root = clsx(classes.root, className);

  return (
    <Card className={root} onClick={navigate}>
      <CardHeader title={post.title}></CardHeader>
      <CardContent>{post.date}</CardContent>
    </Card>
  );
};

export default PostCard;