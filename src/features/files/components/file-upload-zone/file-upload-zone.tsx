import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRef, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export type FileUploadZoneProps = {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
};

export const FileUploadZone = ({ onFilesSelected, isUploading }: FileUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) {
      return;
    }
    const valid = Array.from(files).filter((file) => file.size <= MAX_FILE_SIZE_BYTES);
    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  return (
    <UploadZoneRoot
      $isDragOver={isDragOver}
      $isDisabled={!!isUploading}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type={'file'} multiple onChange={handleInputChange} style={{ display: 'none' }} />
      <UploadIcon $isDragOver={isDragOver} />
      <Typography variant={'body2'} color={'text.secondary'} align={'center'}>
        {isDragOver ? 'Отпустите для загрузки' : 'Перетащите файлы сюда или нажмите для выбора'}
      </Typography>
      <Typography variant={'caption'} color={'text.disabled'} align={'center'}>
        Максимальный размер файла: 100 МБ
      </Typography>
    </UploadZoneRoot>
  );
};

const UploadZoneRoot = styled(Box)<{ $isDragOver: boolean; $isDisabled: boolean }>(
  ({ theme, $isDragOver, $isDisabled }) => ({
    border: `2px dashed ${$isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: $isDisabled ? 'not-allowed' : 'pointer',
    backgroundColor: $isDragOver ? theme.palette.action.hover : 'transparent',
    transition: 'border-color 0.2s, background-color 0.2s',
    opacity: $isDisabled ? 0.6 : 1,
    '&:hover': {
      borderColor: $isDisabled ? theme.palette.divider : theme.palette.primary.main,
      backgroundColor: $isDisabled ? 'transparent' : theme.palette.action.hover,
    },
  }),
);

const UploadIcon = styled(CloudUploadIcon)<{ $isDragOver: boolean }>(({ theme, $isDragOver }) => ({
  fontSize: 40,
  color: $isDragOver ? theme.palette.primary.main : theme.palette.text.disabled,
  transition: 'color 0.2s',
}));
