import React from 'react';
import type { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { getAllPostIds, getPostData, PostCtx, PostId } from '@/lib/posts';
import type { PostData } from '@/lib/posts';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeReact, { createElement: React.createElement });

const Post: React.FC<PropsResult> = ({ postData }) => {
  return (
    <>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
      {processor.processSync(postData.content).result}
    </>
  );
};

export async function getStaticPaths(): Promise<GetStaticPathsResult<PostId>> {
  const paths = getAllPostIds();
  return { paths, fallback: false };
}

type PropsResult = {
  postData: PostData;
};
export async function getStaticProps({
  params,
}: PostCtx): Promise<GetStaticPropsResult<PropsResult>> {
  const postData = getPostData(params.id);

  return { props: { postData } };
}

export default Post;
