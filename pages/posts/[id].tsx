import React from 'react';
import Container from '@material-ui/core/Container';
import type { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { getPostIds, getPostData, PostCtx, PostId } from '@/lib/posts';
import type { PostData } from '@/lib/posts';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import Code from '@/components/Code';

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
    <Container>
      <h1>{post.title}</h1>
      {post.date}
      {processor.processSync(post.content).result}
    </Container>
  );
};

export default Post;
