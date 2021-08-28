import React from 'react';
import type { GetStaticPropsResult } from 'next';
import Container from '@material-ui/core/Container';
import PostCard from '@/components/PostCard';
import { getPostIds, getPostData, PostData } from '@/lib/posts';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const POST_LIMIT = 30;

type Props = {
  posts: PostData[];
};
export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const ids = await getPostIds(POST_LIMIT);
  const posts = await Promise.all(ids.map(getPostData));

  return { props: { posts } };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
    card: {
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut,
      }),
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    },
  })
);

const PostIndex: React.FC<Props> = ({ posts }) => {
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.cardList}>
        {posts.map(post => (
          <PostCard className={classes.card} key={post.id} post={post} />
        ))}
      </div>
    </Container>
  );
};

export default PostIndex;
