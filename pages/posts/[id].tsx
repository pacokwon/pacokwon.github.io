import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import type { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import Code from '@/components/Code';
import { getPostIds, getPostData, PostCtx, PostId } from '@/lib/posts';
import type { PostData } from '@/lib/posts';

export async function getStaticPaths(): Promise<GetStaticPathsResult<PostId>> {
  const ids = await getPostIds();
  const paths = ids.map(id => ({ params: { id } }));
  return { paths, fallback: false };
}

type Props = {
  post: PostData;
};
export async function getStaticProps({
  params,
}: PostCtx): Promise<GetStaticPropsResult<Props>> {
  const post = await getPostData(params.id);
  return { props: { post } };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeReact, {
    createElement: React.createElement,
    components: {
      code: Code,
    },
  });

const Post: React.FC<Props> = ({ post }) => {
  return (
    <Container maxWidth="md">
      <Paper variant="outlined">
        <Box px={5} pt={2} pb={4}>
          <h1>{post.title}</h1>
          Written in: {post.date}
          {processor.processSync(post.content).result}
        </Box>
      </Paper>
    </Container>
  );
};

export default Post;
