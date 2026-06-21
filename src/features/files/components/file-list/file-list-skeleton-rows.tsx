import { Skeleton, TableCell, TableRow } from '@mui/material';

const SKELETON_ROW_COUNT = 8;

export const FileListSkeletonRows = () => {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <TableRow key={index}>
          <TableCell width={40}>
            <Skeleton variant={'circular'} width={20} height={20} />
          </TableCell>
          <TableCell>
            <Skeleton width={'55%'} />
          </TableCell>
          <TableCell width={80}>
            <Skeleton width={'65%'} />
          </TableCell>
          <TableCell width={60}>
            <Skeleton variant={'rounded'} width={36} height={20} />
          </TableCell>
          <TableCell width={160}>
            <Skeleton width={'75%'} />
          </TableCell>
          <TableCell width={160}>
            <Skeleton width={'80%'} />
          </TableCell>
          <TableCell width={48} />
        </TableRow>
      ))}
    </>
  );
};
