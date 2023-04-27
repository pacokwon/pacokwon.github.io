import React from 'react';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import MuiCardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import Chip from '@/components/Chip';

import { PostData } from '@/lib/posts';

const CardHeader = styled(MuiCardHeader)({
  '& .MuiCardHeader-title': {
    fontWeight: 'bold',
  },
});

const PostDate = styled('span')(({ theme }) => ({
  fontWeight: 'bold',
  paddingLeft: theme.spacing(0.5),
}));

const PostTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const BlockLink = styled(NextLink)({
  display: 'block',
});

interface Props extends React.HTMLAttributes<HTMLElement> {
  post: PostData;
}

const PostCard: React.FC<Props> = ({ post, className }) => {
  const path = `/posts/${post.id}`;

  return (
    <BlockLink href={path}>
      <Card className={className} sx={{ cursor: 'pointer' }}>
        <CardHeader title={post.title} />
        <CardContent sx={{ paddingTop: 0 }}>
          <PostDate>{post.date}</PostDate>
          <PostTags>
            {post.tags.map(tag => (
              <Chip key={tag} color="primary" label={tag} size="small" />
            ))}
          </PostTags>
        </CardContent>
      </Card>
    </BlockLink>
  );
};

export default PostCard;
