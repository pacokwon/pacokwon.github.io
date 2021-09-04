import React from 'react';
import type { GetStaticPropsResult } from 'next';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';
import { getPostIds, getPostData, PostData } from '@/lib/posts';
import BreakpointMasonry from '@/components/BreakpointMasonry';

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
    <>
      <Meta title="Paco Kwon's Blog Posts" />
      <Container>
        <BreakpointMasonry>
          {posts.map(post => (
            <PostCard className={classes.card} key={post.id} post={post} />
          ))}
        </BreakpointMasonry>
      </Container>
    </>
  );
};

export default PostIndex;
