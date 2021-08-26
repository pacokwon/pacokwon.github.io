import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const postsPath = 'posts';

export type PostId = { id: string };
export type PostCtx = { params: PostId };

// get up to `limit` number of post ids.
export async function getPostIds(limit?: number): Promise<string[]> {
  const all = await fs.readdir(postsPath);

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
  date?: string;
  tags?: string;
};

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsPath, `${id}.md`);
  const contents = await fs.readFile(fullPath, 'utf8');

  const { content, data } = matter(contents);
  const metadata = parseMetadata(data);

  return {
    id,
    content,
    ...metadata,
  };
}

function parseMetadata(meta: PostMetadataRaw) {
  const title = meta.title ?? 'Untitled';

  const dateObj = new Date(meta.date);
  const date = isNaN(dateObj.getTime()) ? null : meta.date;

  // comma separated tags
  const tags = meta.tags?.split(',') ?? [];

  return { ...meta, title, date, tags };
}
