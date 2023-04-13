import React from 'react';
import MuiContainer from '@mui/material/Container';
import MuiPaper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import type { GetStaticPathsResult, GetStaticPropsResult } from 'next';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';

import Anchor from '@/components/Anchor';
import Chip from '@/components/Chip';
import Code from '@/components/Code';
import Meta from '@/components/Meta';
import UtterancesComments from '@/components/UtterancesComments';

import { getPostIds, getPostData, PostCtx, PostId } from '@/lib/posts';
import type { PostData } from '@/lib/posts';
import { options } from '@/lib/languages';

type Props = {
  post: PostData;
};

export async function getStaticPaths(): Promise<GetStaticPathsResult<PostId>> {
  const ids = await getPostIds();
  const paths = ids.map(id => ({ params: { id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: PostCtx): Promise<GetStaticPropsResult<Props>> {
  const post = await getPostData(params.id);
  return { props: { post } };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight, options)
  .use(rehypeReact, {
    createElement: React.createElement,
    components: {
      code: Code,
      a: Anchor,
    },
  });

const Paper = styled(MuiPaper)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2, 4),
  },
  padding: theme.spacing(2, 5, 4),
}));

const Container = styled(MuiContainer)(({ theme }) => ({
  '&.MuiContainer-root': {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },
}));

const PostContent = styled('div')(({ theme }) => ({
  '& h1, & h2, & h3': {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  '& p': {
    margin: theme.spacing(1, 0),
    fontSize: 'var(--fs-300)',
  },
  '& ul, & li': {
    listStylePosition: 'inside',
  },
}));

const PostDate = styled('div')(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const PostTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const Post: React.FC<Props> = ({ post }) => {
  return (
    <>
      <Meta title={post.title} />
      <Container maxWidth="md">
        <Paper elevation={0}>
          <PostContent>
            <h1>{post.title}</h1>
            <PostDate>{post.date}</PostDate>
            <PostTags>
              {post.tags.map(tag => (
                <Chip key={tag} color="primary" label={tag} size="small" />
              ))}
            </PostTags>
            {processor.processSync(post.content).result}
          </PostContent>
        </Paper>
        <UtterancesComments />
      </Container>
    </>
  );
};

export default Post;
