import FolderIcon from '@mui/icons-material/Folder';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Box, CircularProgress, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import type { FileDto, FolderDto, NoteDto } from '@/api/generated/types';
import { paths } from '@/config/paths';
import { getMimeIcon } from '@/utils/file.utils';
import { formatFileSize } from '@/utils/format.utils';

const NOTE_CONTENT_MAX_LENGTH = 80;

export type SearchResultsProps = {
  files: FileDto[];
  folders: FolderDto[];
  notes: NoteDto[];
  isLoading: boolean;
  isEnabled: boolean;
  query: string;
  onClose: () => void;
};

export const SearchResults = ({ files, folders, notes, isLoading, isEnabled, query, onClose }: SearchResultsProps) => {
  const navigate = useNavigate();

  const handleFileClick = (file: FileDto) => {
    navigate(file.folderId !== null ? paths.folder.getHref(file.folderId) : paths.drive.getHref());
    onClose();
  };

  const handleFolderClick = (folder: FolderDto) => {
    navigate(paths.folder.getHref(folder.id));
    onClose();
  };

  const handleNoteClick = () => {
    navigate(paths.drive.getHref());
    onClose();
  };

  if (!isEnabled) {
    return <SearchHint variant={'body2'}>Введите не менее 2 символов для поиска</SearchHint>;
  }

  if (isLoading) {
    return (
      <LoadingBox>
        <CircularProgress size={24} />
      </LoadingBox>
    );
  }

  const hasResults = files.length > 0 || folders.length > 0 || notes.length > 0;

  if (!hasResults) {
    return <SearchHint variant={'body2'}>{`По запросу «${query}» ничего не найдено`}</SearchHint>;
  }

  return (
    <ResultsContainer>
      {files.length > 0 && (
        <ResultSection>
          <SectionLabel variant={'caption'}>{`Файлы (${files.length})`}</SectionLabel>
          <List dense={true} disablePadding={true}>
            {files.map((file) => {
              const MimeIcon = getMimeIcon(file.mimeType);
              return (
                <ListItemButton
                  key={file.id}
                  onClick={() => {
                    handleFileClick(file);
                  }}
                >
                  <ResultItemIcon>
                    <MimeIcon fontSize={'small'} />
                  </ResultItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                    primaryTypographyProps={{ noWrap: true }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </ResultSection>
      )}

      {folders.length > 0 && (
        <ResultSection>
          <SectionLabel variant={'caption'}>{`Папки (${folders.length})`}</SectionLabel>
          <List dense={true} disablePadding={true}>
            {folders.map((folder) => {
              return (
                <ListItemButton
                  key={folder.id}
                  onClick={() => {
                    handleFolderClick(folder);
                  }}
                >
                  <ResultItemIcon>
                    <FolderIcon fontSize={'small'} />
                  </ResultItemIcon>
                  <ListItemText
                    primary={folder.name}
                    secondary={folder.path}
                    primaryTypographyProps={{ noWrap: true }}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </ResultSection>
      )}

      {notes.length > 0 && (
        <ResultSection>
          <SectionLabel variant={'caption'}>{`Заметки (${notes.length})`}</SectionLabel>
          <List dense={true} disablePadding={true}>
            {notes.map((note) => {
              const excerpt =
                note.content.length > NOTE_CONTENT_MAX_LENGTH
                  ? `${note.content.slice(0, NOTE_CONTENT_MAX_LENGTH)}…`
                  : note.content;
              return (
                <ListItemButton key={note.id} onClick={handleNoteClick}>
                  <ResultItemIcon>
                    <NoteAltIcon fontSize={'small'} />
                  </ResultItemIcon>
                  <ListItemText primary={excerpt} primaryTypographyProps={{ noWrap: true }} />
                </ListItemButton>
              );
            })}
          </List>
        </ResultSection>
      )}
    </ResultsContainer>
  );
};

const SearchHint = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(3),
  textAlign: 'center',
  display: 'block',
}));

const LoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const ResultsContainer = styled(Box)(({ theme }) => ({
  maxHeight: 480,
  overflowY: 'auto',
  paddingBottom: theme.spacing(1),
}));

const ResultSection = styled(Box)(({ theme }) => ({
  '& + &': {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
  },
}));

const SectionLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  letterSpacing: '0.05em',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
}));

const ResultItemIcon = styled(ListItemIcon)({
  minWidth: 36,
});
