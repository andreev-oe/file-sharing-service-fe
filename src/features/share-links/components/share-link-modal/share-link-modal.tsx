import { zodResolver } from '@hookform/resolvers/zod';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import {
  Alert,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { ShareLinkDto } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import type { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';
import { paths } from '@/config/paths';
import { getApiErrorMessage } from '@/utils/api.utils';

import { useCreateShareLink } from '../../hooks/use-create-share-link';
import { useDeactivateShareLink } from '../../hooks/use-deactivate-share-link';

const TTL_1_HOUR = 3600;
const TTL_24_HOURS = 86400;
const TTL_7_DAYS = 604800;
const TTL_NO_LIMIT = 0;

const TTL_OPTIONS = [
  { label: '1 час', value: TTL_1_HOUR },
  { label: '24 часа', value: TTL_24_HOURS },
  { label: '7 дней', value: TTL_7_DAYS },
  { label: 'Без ограничений', value: TTL_NO_LIMIT },
];

const shareLinkSchema = z.object({
  ttlSeconds: z.number(),
  password: z.string(),
  maxDownloads: z.string().refine(
    (value) => {
      if (value === '') {
        return true;
      }
      const number = Number(value);
      return Number.isInteger(number) && number > 0;
    },
    { message: 'Введите целое число больше 0' },
  ),
});

type ShareLinkFormValues = z.infer<typeof shareLinkSchema>;

type FormStepProps = {
  fileId: string;
  fileName: string;
  onCreated: (link: ShareLinkDto) => void;
};

const FormStep = ({ fileId, fileName, onCreated }: FormStepProps) => {
  const { mutateAsync, isPending, error } = useCreateShareLink();

  const { control, handleSubmit } = useForm<ShareLinkFormValues>({
    resolver: zodResolver(shareLinkSchema),
    defaultValues: { ttlSeconds: TTL_24_HOURS, password: '', maxDownloads: '' },
  });

  const onSubmit = async (values: ShareLinkFormValues) => {
    const link = await mutateAsync({
      data: {
        fileId,
        ttlSeconds: values.ttlSeconds,
        password: values.password || undefined,
        maxDownloads: values.maxDownloads ? Number(values.maxDownloads) : undefined,
      },
    });
    onCreated(link);
  };

  return (
    <>
      <DialogTitle>{`Поделиться: ${fileName}`}</DialogTitle>
      <DialogContent>
        <FormFields gap={2.5}>
          <Controller
            name={'ttlSeconds'}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={'ttl-label'}>Срок действия</InputLabel>
                <Select labelId={'ttl-label'} label={'Срок действия'} {...field}>
                  {TTL_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name={'password'}
            control={control}
            render={({ field }) => (
              <TextField {...field} label={'Пароль (необязательно)'} fullWidth type={'text'} autoComplete={'off'} />
            )}
          />
          <Controller
            name={'maxDownloads'}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={'Лимит скачиваний (необязательно)'}
                fullWidth
                type={'number'}
                slotProps={{ htmlInput: { min: 1 } }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          {error && <Alert severity={'error'}>{getApiErrorMessage(error)}</Alert>}
        </FormFields>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'} loading={isPending} onClick={handleSubmit(onSubmit)}>
          Создать ссылку
        </Button>
      </DialogActions>
    </>
  );
};

type ResultStepProps = {
  link: ShareLinkDto;
  onClose: () => void;
  onDeactivated: () => void;
};

const ResultStep = ({ link, onClose, onDeactivated }: ResultStepProps) => {
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateShareLink();
  const [copied, setCopied] = useState(false);
  const linkUrl = `${window.location.origin}${paths.share.getHref(link.token)}`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDeactivate = () => {
    deactivate(
      { id: link.token },
      {
        onSuccess: () => {
          onDeactivated();
        },
      },
    );
  };

  return (
    <>
      <DialogTitle>Ссылка создана</DialogTitle>
      <DialogContent>
        <ResultStack gap={2}>
          <LinkUrlBox>
            <LinkUrlText variant={'body2'} noWrap>
              {linkUrl}
            </LinkUrlText>
            <Button
              size={'small'}
              variant={copied ? 'contained' : 'outlined'}
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
            >
              {copied ? 'Скопировано' : 'Копировать'}
            </Button>
          </LinkUrlBox>

          {link.maxDownloads !== null && (
            <DownloadProgressBox>
              <Typography variant={'caption'} color={'text.secondary'}>
                {`Скачиваний: ${link.downloadCount} / ${link.maxDownloads}`}
              </Typography>
              <LinearProgress variant={'determinate'} value={(link.downloadCount / link.maxDownloads) * 100} />
            </DownloadProgressBox>
          )}

          {link.expiresAt && (
            <Typography variant={'caption'} color={'text.secondary'}>
              {`Истекает: ${new Date(link.expiresAt).toLocaleString('ru-RU')}`}
            </Typography>
          )}
        </ResultStack>
      </DialogContent>
      <DialogActions>
        <Button color={'error'} startIcon={<LinkOffIcon />} loading={isDeactivating} onClick={handleDeactivate}>
          Деактивировать
        </Button>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </>
  );
};

export type ShareLinkModalProps = {
  fileId: string;
  fileName: string;
};

export const ShareLinkModal = ({ id, innerProps }: ContextModalProps<ShareLinkModalProps>) => {
  const { fileId, fileName } = innerProps;
  const [createdLink, setCreatedLink] = useState<ShareLinkDto | null>(null);

  const handleClose = () => {
    modals.closeModal(id);
  };

  if (createdLink) {
    return <ResultStep link={createdLink} onClose={handleClose} onDeactivated={handleClose} />;
  }

  return <FormStep fileId={fileId} fileName={fileName} onCreated={setCreatedLink} />;
};

const FormFields = styled(Stack)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
}));

const ResultStack = styled(Stack)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
}));

const LinkUrlBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const LinkUrlText = styled(Typography)({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const DownloadProgressBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});
