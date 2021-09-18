import React from 'react';
import { useRouter } from 'next/router';
import { teal } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import MuiCardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import MuiChip from '@mui/material/Chip';
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

const Chip = styled(MuiChip)({
  '&.MuiChip-colorPrimary': {
    background: teal[200],
  },
});

interface Props extends React.HTMLAttributes<HTMLElement> {
  post: PostData;
}

const PostCard: React.FC<Props> = ({ post, className }) => {
  const router = useRouter();

  const path = `/posts/${post.id}`;
  const navigate = () => router.push(path);

  return (
    <Card className={className} sx={{ cursor: 'pointer' }} onClick={navigate}>
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
  );
};

export default PostCard;
