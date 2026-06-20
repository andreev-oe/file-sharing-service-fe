import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Badge, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { ChangeEvent, useRef } from 'react';

import { useAuthStore } from '@/store/auth.store';

import { useUploadAvatar } from '../../hooks/use-upload-avatar';

export const AvatarUpload = () => {
  const { user } = useAuthStore();
  const uploadMutation = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    uploadMutation.mutate({ data: { file } });
    event.target.value = '';
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Tooltip title="Изменить фото">
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                width: 28,
                height: 28,
                border: '2px solid #fff',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              {uploadMutation.isPending ? (
                <CircularProgress size={14} sx={{ color: '#fff' }} />
              ) : (
                <EditIcon sx={{ fontSize: 14 }} />
              )}
            </IconButton>
          </Tooltip>
        }
      >
        <Avatar
          src={user?.avatarUrl ?? undefined}
          sx={{
            width: 88,
            height: 88,
            bgcolor: 'primary.main',
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
      </Badge>
    </>
  );
};
