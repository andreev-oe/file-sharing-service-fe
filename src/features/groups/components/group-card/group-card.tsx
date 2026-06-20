import GroupIcon from '@mui/icons-material/Group';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/config/paths';

export type GroupCardProps = {
  groupId: string;
  name: string;
  description?: string;
  createdAt: string;
};

export const GroupCard = ({ groupId, name, description, createdAt }: GroupCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(paths.group.getHref(groupId));
  };

  const formattedDate = new Date(createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <StyledCard>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <CardHeader>
            <GroupCardIcon />
            <Typography variant={'subtitle1'} fontWeight={600} noWrap>
              {name}
            </Typography>
          </CardHeader>
          {description && (
            <CardDescription variant={'body2'} color={'text.secondary'}>
              {description}
            </CardDescription>
          )}
          <Typography variant={'caption'} color={'text.disabled'}>
            {`Создана ${formattedDate}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
}));

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 4,
});

const GroupCardIcon = styled(GroupIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 20,
  flexShrink: 0,
}));

const CardDescription = styled(Typography)({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  marginBottom: 4,
});
