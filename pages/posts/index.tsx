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

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    cardList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
  })
);

const PostIndex: React.FC<Props> = ({ posts }) => {
  const classes = useStyle();

  return (
    <Container>
      <div className={classes.cardList}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Container>
  );
};

export default PostIndex;
