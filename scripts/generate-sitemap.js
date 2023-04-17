/* eslint-disable */
const fs = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');

const BASE_URL = 'https://www.pacokwon.org';
const POSTS_PATH = 'posts';

async function getPostIds() {
  const filenames = await fs
    .readdir(POSTS_PATH)
    .then(filenames =>
      filenames
        .sort((a, b) => (a > b ? -1 : 1))
        .filter(filename => filename.endsWith('.md'))
    );

  return filenames.map(filename => filename.replace(/\.md$/, ''));
}

async function getPostData(id) {
  const fullPath = path.join(POSTS_PATH, `${id}.md`);
  const contents = await fs.readFile(fullPath, 'utf8');

  const { content, data } = matter(contents);
  const metadata = parseMetadata(id, data);

  return {
    id,
    content,
    ...metadata,
  };
}

function parseDate(date) {
  if (date.indexOf('-') !== 8) return null;

  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  return `${year}-${month}-${day}`;
}

function parseMetadata(id, meta) {
  const title = meta.title ?? 'Untitled';

  const date = parseDate(id);
  const tags = meta.tags ?? [];

  return { ...meta, title, date, tags };
}

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 ${posts
   .map(({ id }) => {
     return `
  <url>
    <loc>${BASE_URL}/posts/${id}</loc>
    <changefreq>monthly</changefreq>
  </url>
    `;
   })
   .join('')}
</urlset>
 `;
}

async function main() {
  const ids = await getPostIds();
  const posts = await Promise.all(ids.map(getPostData));
  const sitemap = generateSiteMap(posts);
  await fs.writeFile('public/sitemap.xml', sitemap);
}

main();
