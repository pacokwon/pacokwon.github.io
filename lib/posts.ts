import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const postsPath = 'posts';

export type PostId = { id: string };
export type PostCtx = { params: PostId };

// get up to `limit` number of post ids.
export async function getPostIds(limit?: number): Promise<string[]> {
  const all = await fs
    .readdir(postsPath)
    .then(filenames =>
      filenames
        .sort((a, b) => (a > b ? -1 : 1))
        .filter(filename => filename.endsWith('.md'))
    );

  // filter if limit is imposed
  const filenames =
    limit === undefined ? all : all.filter((_, idx) => idx < limit);

  return filenames.map(filename => filename.replace(/\.md$/, ''));
}

export type PostData = {
  id: string;
  content: string;
  title: string;
  date: string | null;
  tags: string[];
};

type PostMetadataRaw = {
  title?: string;
  tags?: string[];
};

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsPath, `${id}.md`);
  const contents = await fs.readFile(fullPath, 'utf8');

  const { content, data } = matter(contents);
  const metadata = parseMetadata(id, data);

  return {
    id,
    content,
    ...metadata,
  };
}

function parseDate(date: string) {
  if (date.indexOf('-') !== 8) return null;

  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  return `${year}-${month}-${day}`;
}

function parseMetadata(id: string, meta: PostMetadataRaw) {
  const title = meta.title ?? 'Untitled';

  const date = parseDate(id);
  const tags = meta.tags ?? [];

  return { ...meta, title, date, tags };
}
