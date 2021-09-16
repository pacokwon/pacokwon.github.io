import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import type { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import Code from '@/components/Code';
import Meta from '@/components/Meta';
import { getPostIds, getPostData, PostCtx, PostId } from '@/lib/posts';
import type { PostData } from '@/lib/posts';
import { options } from '@/lib/languages';

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
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight, options)
  .use(rehypeReact, {
    createElement: React.createElement,
    components: {
      code: Code,
    },
  });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerRoot: {
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0),
      },
    },
    paper: {
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2, 2, 4),
      },
      padding: theme.spacing(2, 5, 4),
    },
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
        fontSize: 'var(--fs-300)',
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
    <>
      <Meta title={post.title} />
      <Container classes={{ root: classes.containerRoot }} maxWidth="md">
        <Paper className={classes.paper} variant="outlined">
          <div className={classes.content}>
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
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default Post;
