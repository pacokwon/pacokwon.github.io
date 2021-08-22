import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsPath = 'posts';

export type PostId = { id: string };
export type PostCtx = { params: PostId };
export function getAllPostIds(): PostCtx[] {
  console.log(fs.readdirSync('.'));
  const filenames = fs.readdirSync(postsPath);

  return filenames.map(filename => ({
    params: {
      id: filename.replace(/\.md$/, ''),
    },
  }));
}

export type PostData = { [key: string]: any };
export function getPostData(id: string): PostData {
  const fullPath = path.join(postsPath, `${id}.md`);
  const contents = fs.readFileSync(fullPath, 'utf8');

  const { data } = matter(contents);

  return {
    id,
    ...data,
  };
}
