import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { modeSensitive } from '@/lib/theme';
import links from '@/data/links.json';
import { useTheme } from '@mui/material/styles';

type LinkProps = {
  alias: string;
  date: string;
  description: string;
  uuid: string;
  link: string;
};

// Named this way to avoid name conflict with mui Link
const ExternalLink: React.FC<LinkProps> = ({ alias, description, link }) => {
  const theme = useTheme();
  const descriptionExists = description !== '';

  return (
    <Box
      style={{ wordWrap: 'break-word', fontFamily: 'Arial, sans-serif' }}
      mb={1}
    >
      <Link
        target="_blank"
        rel="noreferrer"
        href={link}
        color={modeSensitive(theme, '#444', theme.palette.text.primary)}
        sx={{ fontWeight: 'bold' }}
        underline="always"
      >
        {alias}
      </Link>
      {descriptionExists && (
        <span style={{ fontSize: '0.9rem' }}> - {description}</span>
      )}
    </Box>
  );
};

type CategoryProps = {
  category: string;
  links: LinkProps[];
};

const Category: React.FC<CategoryProps> = ({ category, links }) => (
  <Box mb={5}>
    <Typography sx={{ mb: 2, fontWeight: 'bold' }} variant="h5">
      {category}
    </Typography>
    {links.map(link => (
      <ExternalLink key={link.uuid} {...link} />
    ))}
  </Box>
);

const Index: React.FC = () => {
  return (
    <>
      <Meta title="Paco Kwon - Links" />
      <Container>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          These are my personal collection of interesting &quot;read later&quot;
          links
        </Typography>
        {Object.entries(links).map(([category, links]) => (
          <Category key={category} category={category} links={links} />
        ))}
      </Container>
    </>
  );
};

export default Index;
