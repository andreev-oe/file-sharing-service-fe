import { Card, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

const SKELETON_GRID_COUNT = 12;

export const FileListSkeletonGrid = () => {
  return (
    <>
      {Array.from({ length: SKELETON_GRID_COUNT }, (_, index) => (
        <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
          <SkeletonGridCard>
            <Skeleton variant={'rounded'} width={48} height={48} />
            <SkeletonGridName width={'70%'} />
            <SkeletonGridMeta width={'45%'} />
          </SkeletonGridCard>
        </Grid>
      ))}
    </>
  );
};

const SkeletonGridCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const SkeletonGridName = styled(Skeleton)({
  fontSize: 12,
});

const SkeletonGridMeta = styled(Skeleton)({
  fontSize: 11,
});
