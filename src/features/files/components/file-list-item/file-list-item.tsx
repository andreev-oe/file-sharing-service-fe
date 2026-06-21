import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Card, Chip, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { FileDto } from '@/api/generated/types';
import { getMimeIcon } from '@/utils/file.utils';
import { formatDate, formatFileSize } from '@/utils/format.utils';

export type FileListItemProps = {
  file: FileDto;
  viewMode: 'list' | 'grid';
  uploaderName?: string;
  isSelected?: boolean;
  isShared?: boolean;
  onSelect: (file: FileDto) => void;
  onMenuOpen: (event: React.MouseEvent, file: FileDto) => void;
};

export const FileListItem = ({
  file,
  viewMode,
  uploaderName,
  isSelected,
  isShared,
  onSelect,
  onMenuOpen,
}: FileListItemProps) => {
  const MimeIcon = getMimeIcon(file.mimeType);

  const handleClick = () => {
    onSelect(file);
  };

  const handleMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onMenuOpen(event, file);
  };

  if (viewMode === 'grid') {
    return (
      <FileGridCard $isSelected={!!isSelected} onClick={handleClick}>
        <GridIconWrapper>
          <GridMimeIcon as={MimeIcon} />
        </GridIconWrapper>
        <GridFileName variant={'body2'} noWrap title={file.name}>
          {file.name}
        </GridFileName>
        <GridMeta variant={'caption'} color={'text.secondary'}>
          {formatFileSize(file.size)}
        </GridMeta>
        <VersionChip label={`v${file.version}`} size={'small'} variant={'outlined'} color={'primary'} />
        <GridMenuButton size={'small'} onClick={handleMenuClick}>
          <MoreVertIcon fontSize={'small'} />
        </GridMenuButton>
        {isShared && (
          <Tooltip title={'Есть активная ссылка'}>
            <GridShareBadge>
              <LinkIcon />
            </GridShareBadge>
          </Tooltip>
        )}
      </FileGridCard>
    );
  }

  return (
    <FileTableRow $isSelected={!!isSelected} onClick={handleClick}>
      <TableCell width={40}>
        <ListMimeIcon as={MimeIcon} />
      </TableCell>
      <TableCell>
        <FileNameCell>
          <Typography variant={'body2'} noWrap>
            {file.name}
          </Typography>
          {isShared && (
            <Tooltip title={'Есть активная ссылка'}>
              <ShareIndicatorIcon fontSize={'small'} />
            </Tooltip>
          )}
        </FileNameCell>
      </TableCell>
      <TableCell width={80}>
        <Typography variant={'body2'} color={'text.secondary'} noWrap>
          {formatFileSize(file.size)}
        </Typography>
      </TableCell>
      <TableCell width={60} align={'center'}>
        <VersionChip label={`v${file.version}`} size={'small'} variant={'outlined'} color={'primary'} />
      </TableCell>
      <TableCell width={160}>
        <Tooltip title={`ID: ${file.uploadedById}`}>
          <Typography variant={'body2'} color={'text.secondary'} noWrap>
            {uploaderName ?? `${file.uploadedById.slice(0, 8)}…`}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell width={160}>
        <Tooltip title={formatDate(new Date(file.updatedAt).getTime())}>
          <Typography variant={'body2'} color={'text.secondary'} noWrap>
            {formatDate(new Date(file.updatedAt).getTime())}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell width={48} padding={'none'}>
        <IconButton size={'small'} onClick={handleMenuClick}>
          <MoreVertIcon fontSize={'small'} />
        </IconButton>
      </TableCell>
    </FileTableRow>
  );
};

const FileTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== '$isSelected',
})<{ $isSelected: boolean }>(({ theme, $isSelected }) => ({
  cursor: 'pointer',
  backgroundColor: $isSelected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: $isSelected ? theme.palette.action.selected : theme.palette.action.hover,
  },
}));

const ListMimeIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 20,
  color: theme.palette.primary.main,
  display: 'block',
}));

const VersionChip = styled(Chip)({
  fontSize: 11,
  height: 20,
});

const FileGridCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== '$isSelected',
})<{ $isSelected: boolean }>(({ theme, $isSelected }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  cursor: 'pointer',
  outline: $isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const GridIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
});

const GridMimeIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 40,
  color: theme.palette.primary.main,
}));

const GridFileName = styled(Typography)({
  width: '100%',
  textAlign: 'center',
  fontSize: 12,
});

const GridMeta = styled(Typography)({
  fontSize: 11,
});

const GridMenuButton = styled(IconButton)({
  position: 'absolute',
  top: 4,
  right: 4,
});

const GridShareBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  left: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: 16,
  '& .MuiSvgIcon-root': {
    fontSize: 16,
  },
}));

const FileNameCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  overflow: 'hidden',
});

const ShareIndicatorIcon = styled(LinkIcon)(({ theme }) => ({
  flexShrink: 0,
  fontSize: 16,
  color: theme.palette.primary.main,
}));
