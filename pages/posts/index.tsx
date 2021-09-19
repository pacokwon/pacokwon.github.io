import React from 'react';
import type { GetStaticPropsResult } from 'next';

import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

import PostCard from '@/components/PostCard';
import BreakpointMasonry from '@/components/BreakpointMasonry';
import Meta from '@/components/Meta';

import { getPostIds, getPostData, PostData } from '@/lib/posts';

const POST_LIMIT = 30;

type Props = {
  posts: PostData[];
};
export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const ids = await getPostIds(POST_LIMIT);
  const posts = await Promise.all(ids.map(getPostData));

  return { props: { posts } };
}

const TransitionPostCard = styled(PostCard)(({ theme }) => ({
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeOut,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const PostIndex: React.FC<Props> = ({ posts }) => (
  <>
    <Meta title="Paco Kwon's Blog Posts" />
    <Container>
      <BreakpointMasonry>
        {posts.map(post => (
          <TransitionPostCard key={post.id} post={post} />
        ))}
      </BreakpointMasonry>
    </Container>
  </>
);

export default PostIndex;
