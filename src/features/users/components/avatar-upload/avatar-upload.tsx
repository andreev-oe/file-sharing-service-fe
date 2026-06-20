import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Badge, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChangeEvent, useRef, useState } from 'react';

import { useAuthStore } from '@/store/auth.store';

import { useUploadAvatar } from '../../hooks/use-upload-avatar';

export const AvatarUpload = () => {
  const { user } = useAuthStore();
  const uploadMutation = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    uploadMutation.mutate(
      { data: { file } },
      {
        onSettled: () => {
          URL.revokeObjectURL(objectUrl);
          setPreview(null);
        },
      },
    );

    event.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type={'file'}
        accept={'image/*'}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Badge
        overlap={'circular'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Tooltip title={'Изменить фото'}>
            <EditAvatarButton
              size={'small'}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? <WhiteCircularProgress size={14} /> : <SmallEditIcon />}
            </EditAvatarButton>
          </Tooltip>
        }
      >
        <UserAvatar $isPending={uploadMutation.isPending} src={preview ?? user?.avatarUrl ?? undefined}>
          {user?.name?.[0]?.toUpperCase()}
        </UserAvatar>
      </Badge>
    </>
  );
};

const EditAvatarButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  width: 28,
  height: 28,
  border: '2px solid #fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

const WhiteCircularProgress = styled(CircularProgress)({
  color: '#fff',
});

const SmallEditIcon = styled(EditIcon)({
  fontSize: 14,
});

const UserAvatar = styled(Avatar)<{ $isPending: boolean }>(({ theme, $isPending }) => ({
  width: 88,
  height: 88,
  backgroundColor: theme.palette.primary.main,
  fontSize: 32,
  fontWeight: 700,
  opacity: $isPending ? 0.7 : 1,
  transition: 'opacity 0.2s',
}));
