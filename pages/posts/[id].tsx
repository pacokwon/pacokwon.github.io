import React from 'react';
import type { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { getPostIds, getPostData, PostCtx, PostId } from '@/lib/posts';
import type { PostData } from '@/lib/posts';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';

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
  .use(rehypeReact, { createElement: React.createElement });

const Post: React.FC<Props> = ({ post }) => {
  return (
    <>
      {post.title}
      <br />
      {post.id}
      <br />
      {post.date}
      {processor.processSync(post.content).result}
    </>
  );
};

export default Post;
