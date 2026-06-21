import SearchIcon from '@mui/icons-material/Search';
import { Box, ButtonBase, Dialog, Divider, InputAdornment, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { useDisclosure } from '@/hooks/use-disclosure';

import { useGlobalSearch } from '../../hooks/use-global-search';
import { SearchResults } from '../search-results';

const SEARCH_DEBOUNCE_MS = 500;
const SEARCH_TRIGGER_KEY = 'k';

export const GlobalSearch = () => {
  const { isOpen, open, close } = useDisclosure();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const { files, folders, notes, isLoading, isEnabled } = useGlobalSearch(debouncedQuery);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === SEARCH_TRIGGER_KEY) {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleClose = () => {
    close();
    setQuery('');
  };

  return (
    <>
      <SearchTriggerButton onClick={open}>
        <SearchIcon fontSize={'small'} />
        <SearchTriggerLabel variant={'body2'}>Поиск...</SearchTriggerLabel>
        <SearchShortcutLabel variant={'caption'}>Ctrl+K</SearchShortcutLabel>
      </SearchTriggerButton>

      <SearchDialog open={isOpen} onClose={handleClose} maxWidth={'sm'} fullWidth={true}>
        <SearchInputBox>
          <TextField
            autoFocus={true}
            fullWidth={true}
            placeholder={'Поиск файлов, папок, заметок...'}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            variant={'standard'}
            slotProps={{
              input: {
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position={'start'}>
                    <SearchIcon color={'action'} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </SearchInputBox>

        <Divider />

        <SearchResults
          files={files}
          folders={folders}
          notes={notes}
          isLoading={isLoading}
          isEnabled={isEnabled}
          query={debouncedQuery}
          onClose={handleClose}
        />
      </SearchDialog>
    </>
  );
};

const SearchTriggerButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.secondary,
  minWidth: 200,
  justifyContent: 'flex-start',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
}));

const SearchTriggerLabel = styled(Typography)({
  flex: 1,
  textAlign: 'left',
});

const SearchShortcutLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontFamily: 'monospace',
}));

const SearchDialog = styled(Dialog)({
  '& .MuiDialog-container': {
    alignItems: 'flex-start',
  },
  '& .MuiDialog-paper': {
    marginTop: '10vh',
  },
});

const SearchInputBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));
