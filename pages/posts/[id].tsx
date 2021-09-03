import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tags: {
      display: 'flex',
      gap: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    date: {
      fontWeight: 'bold',
      marginBottom: theme.spacing(2),
    },
    content: {
      '& h1, & h2, & h3': {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
      },
      '& p': {
        margin: theme.spacing(1, 0),
      },
      '& ul, & li': {
        listStylePosition: 'inside',
      },
    },
    chip: {
      background: teal[200],
    },
  })
);

const Post: React.FC<Props> = ({ post }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="md">
      <Paper variant="outlined">
        <Box className={classes.content} px={5} pt={2} pb={4}>
          <h1>{post.title}</h1>
          <div className={classes.date}>{post.date}</div>
          <div className={classes.tags}>
            {post.tags.map(tag => (
              <Chip
                classes={{ colorPrimary: classes.chip }}
                key={tag}
                color="primary"
                label={tag}
                size="small"
              />
            ))}
          </div>
          {processor.processSync(post.content).result}
        </Box>
      </Paper>
    </Container>
  );
};

export default Post;
