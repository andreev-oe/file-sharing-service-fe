import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SaveIcon from '@mui/icons-material/Save';
import { Box, CircularProgress, Divider, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

import type { NoteDto } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format.utils';

import { useCreateNote } from '../../hooks/use-create-note';
import { useDeleteNote } from '../../hooks/use-delete-note';
import { useNotes } from '../../hooks/use-notes';
import { useUpdateNote } from '../../hooks/use-update-note';

export type FileNotesProps = {
  fileId: string;
};

export const FileNotes = ({ fileId }: FileNotesProps) => {
  const { data: notes, isLoading, isError } = useNotes(fileId);
  const { mutate: createNote, isPending: isCreating } = useCreateNote(fileId);
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote(fileId);
  const { mutate: deleteNote } = useDeleteNote(fileId);

  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const handleCreate = () => {
    const trimmed = newContent.trim();
    if (!trimmed) {
      return;
    }
    createNote(
      { data: { fileId, content: trimmed } },
      {
        onSuccess: () => {
          setNewContent('');
        },
      },
    );
  };

  const handleEditStart = (note: NoteDto) => {
    setEditingId(note.id);
    setEditingContent(note.content);
  };

  const handleEditSave = () => {
    if (!editingId) {
      return;
    }
    const trimmed = editingContent.trim();
    if (!trimmed) {
      return;
    }
    updateNote(
      { id: editingId, data: { content: trimmed } },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingContent('');
        },
      },
    );
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleDelete = (noteId: string) => {
    deleteNote({ id: noteId });
  };

  return (
    <NotesRoot>
      <NotesSectionHeader>
        <NoteAddIcon fontSize={'small'} color={'primary'} />
        <Typography variant={'subtitle2'} fontWeight={600}>
          Заметки
        </Typography>
      </NotesSectionHeader>

      <NotesScrollArea>
        {isLoading && (
          <Stack alignItems={'center'} py={2}>
            <CircularProgress size={20} />
          </Stack>
        )}

        {!isLoading && isError && (
          <Typography variant={'caption'} color={'error'} pb={1}>
            Не удалось загрузить заметки
          </Typography>
        )}

        {!isLoading && !isError && notes.length === 0 && (
          <Typography variant={'caption'} color={'text.disabled'} pb={1}>
            Нет заметок
          </Typography>
        )}

        {!isLoading &&
          !isError &&
          notes.map((note) => (
            <NoteItem key={note.id}>
              {editingId === note.id ? (
                <Stack gap={0.5}>
                  <TextField
                    multiline
                    minRows={2}
                    maxRows={6}
                    size={'small'}
                    value={editingContent}
                    onChange={(event) => {
                      setEditingContent(event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        handleEditCancel();
                      }
                    }}
                    autoFocus
                    fullWidth
                  />
                  <Stack direction={'row'} gap={0.5} justifyContent={'flex-end'}>
                    <Button size={'small'} variant={'text'} onClick={handleEditCancel}>
                      Отмена
                    </Button>
                    <Button
                      size={'small'}
                      variant={'contained'}
                      startIcon={<SaveIcon fontSize={'small'} />}
                      loading={isUpdating}
                      onClick={handleEditSave}
                    >
                      Сохранить
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack direction={'row'} alignItems={'flex-start'} gap={0.5}>
                  <NoteContent>
                    <Typography variant={'body2'} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {note.content}
                    </Typography>
                    <Typography variant={'caption'} color={'text.disabled'}>
                      {formatDate(new Date(note.updatedAt).getTime())}
                    </Typography>
                  </NoteContent>
                  <NoteActions>
                    <Tooltip title={'Редактировать'}>
                      <IconButton
                        size={'small'}
                        onClick={() => {
                          handleEditStart(note);
                        }}
                      >
                        <EditIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'Удалить'}>
                      <IconButton
                        size={'small'}
                        color={'error'}
                        onClick={() => {
                          handleDelete(note.id);
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </NoteActions>
                </Stack>
              )}
            </NoteItem>
          ))}
      </NotesScrollArea>

      <Divider />

      <AddNoteForm>
        <TextField
          multiline
          minRows={2}
          maxRows={4}
          size={'small'}
          placeholder={'Добавить заметку…'}
          value={newContent}
          onChange={(event) => {
            setNewContent(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
              handleCreate();
            }
          }}
          fullWidth
        />
        <Button
          size={'small'}
          variant={'contained'}
          fullWidth
          loading={isCreating}
          disabled={!newContent.trim()}
          onClick={handleCreate}
        >
          Добавить
        </Button>
      </AddNoteForm>
    </NotesRoot>
  );
};

const NotesRoot = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: theme.spacing(1),
}));

const NotesSectionHeader = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  flexShrink: 0,
  paddingBottom: theme.spacing(0.5),
}));

const NotesScrollArea = styled(Box)({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const NoteItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.75, 0),
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const NoteContent = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

const NoteActions = styled(Box)({
  display: 'flex',
  flexShrink: 0,
});

const AddNoteForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  paddingTop: theme.spacing(0.75),
  flexShrink: 0,
}));
