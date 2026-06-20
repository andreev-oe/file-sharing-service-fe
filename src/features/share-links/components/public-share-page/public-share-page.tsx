import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import LockIcon from '@mui/icons-material/Lock';
import { Alert, Box, CircularProgress, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AxiosError } from 'axios';
import { useState } from 'react';

import { shareLinksControllerGetDownloadUrl } from '@/api/generated/endpoints/share-links/share-links';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/utils/format.utils';

import { useShareLink } from '../../hooks/use-share-link';

const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_FORBIDDEN = 403;
const HTTP_STATUS_GONE = 410;

type PublicSharePageProps = {
  token: string;
};

export const PublicSharePage = ({ token }: PublicSharePageProps) => {
  const [submittedPassword, setSubmittedPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading, error } = useShareLink(token, submittedPassword);

  const errorStatus = error instanceof AxiosError ? error.response?.status : undefined;
  const needsPassword = errorStatus === HTTP_STATUS_UNAUTHORIZED || errorStatus === HTTP_STATUS_FORBIDDEN;
  const isExpired = errorStatus === HTTP_STATUS_GONE;

  const handlePasswordSubmit = () => {
    setSubmittedPassword(passwordInput);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await shareLinksControllerGetDownloadUrl(token, { password: submittedPassword });
      window.open(response.url, '_blank');
    } catch (_error) {
      // global interceptor handles error notification
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <PageRoot>
        <Stack alignItems={'center'} gap={2}>
          <CircularProgress />
          <Typography variant={'body2'} color={'text.secondary'}>
            Загрузка...
          </Typography>
        </Stack>
      </PageRoot>
    );
  }

  if (isExpired) {
    return (
      <PageRoot>
        <ErrorCard gap={2}>
          <ExpiredIcon />
          <Typography variant={'h6'}>Ссылка недоступна</Typography>
          <Typography variant={'body2'} color={'text.secondary'} textAlign={'center'}>
            Ссылка истекла или достигнут лимит скачиваний.
          </Typography>
        </ErrorCard>
      </PageRoot>
    );
  }

  if (needsPassword) {
    return (
      <PageRoot>
        <PasswordCard gap={2}>
          <PasswordIcon />
          <Typography variant={'h6'}>Введите пароль</Typography>
          {submittedPassword && <Alert severity={'error'}>Неверный пароль, попробуйте ещё раз</Alert>}
          <TextField
            label={'Пароль'}
            type={'password'}
            value={passwordInput}
            onChange={(event) => {
              setPasswordInput(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handlePasswordSubmit();
              }
            }}
            fullWidth
            autoFocus
          />
          <Button variant={'contained'} fullWidth onClick={handlePasswordSubmit}>
            Открыть
          </Button>
        </PasswordCard>
      </PageRoot>
    );
  }

  if (!data) {
    return null;
  }

  const file = data.file;

  return (
    <PageRoot>
      <FileCard gap={3}>
        <Stack direction={'row'} alignItems={'center'} gap={2}>
          <FileIcon />
          <Stack>
            <Typography variant={'h6'} fontWeight={600}>
              {file?.name ?? 'Файл'}
            </Typography>
            {file && (
              <Typography variant={'body2'} color={'text.secondary'}>
                {`${formatFileSize(file.size)} · ${file.mimeType}`}
              </Typography>
            )}
          </Stack>
        </Stack>

        {data.maxDownloads !== null && (
          <DownloadProgressBox>
            <Typography variant={'caption'} color={'text.secondary'}>
              {`Скачиваний: ${data.downloadCount} / ${data.maxDownloads}`}
            </Typography>
            <LinearProgress variant={'determinate'} value={(data.downloadCount / data.maxDownloads) * 100} />
          </DownloadProgressBox>
        )}

        {data.expiresAt && (
          <Typography variant={'caption'} color={'text.secondary'}>
            {`Истекает: ${new Date(data.expiresAt).toLocaleString('ru-RU')}`}
          </Typography>
        )}

        <Button
          variant={'contained'}
          size={'large'}
          startIcon={<DownloadIcon />}
          loading={isDownloading}
          onClick={handleDownload}
          fullWidth
        >
          Скачать
        </Button>
      </FileCard>
    </PageRoot>
  );
};

const PageRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const FileCard = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 480,
  boxShadow: theme.shadows[2],
}));

const PasswordCard = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 360,
  alignItems: 'center',
  boxShadow: theme.shadows[2],
}));

const ErrorCard = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  alignItems: 'center',
  boxShadow: theme.shadows[2],
}));

const FileIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

const DownloadProgressBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

const ExpiredIcon = styled(LinkOffIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.text.disabled,
}));

const PasswordIcon = styled(LockIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
}));
