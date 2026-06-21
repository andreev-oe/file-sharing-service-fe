import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { CreateReportDtoFormat, CreateReportDtoType } from '@/api/generated/types';
import type { FolderTreeNodeDto, ReportJobDto } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { useFolderTree } from '@/features/folders/hooks/use-folder-tree';
import { useGroups } from '@/features/groups/hooks/use-groups';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/api.utils';

import { useEnqueueReport } from '../../hooks/use-enqueue-report';

type FlatFolder = {
  id: string;
  label: string;
};

const flattenFolderTree = (nodes: FolderTreeNodeDto[], depth = 0): FlatFolder[] => {
  return nodes.flatMap((node) => [
    { id: node.id, label: `${'  '.repeat(depth)}${node.name}` },
    ...flattenFolderTree(node.children, depth + 1),
  ]);
};

const createReportSchema = z
  .object({
    type: z.enum([CreateReportDtoType.user, CreateReportDtoType.folder, CreateReportDtoType.group]),
    format: z.enum([CreateReportDtoFormat.csv, CreateReportDtoFormat.pdf]),
    subjectId: z.string(),
    from: z.string().optional(),
    to: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== CreateReportDtoType.user && !data.subjectId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: data.type === CreateReportDtoType.folder ? 'Выберите папку' : 'Выберите группу',
        path: ['subjectId'],
      });
    }
  });

type CreateReportFormValues = z.infer<typeof createReportSchema>;

export type CreateReportFormProps = {
  onJobCreated: (job: ReportJobDto) => void;
};

export const CreateReportForm = ({ onJobCreated }: CreateReportFormProps) => {
  const user = useAuthStore((state) => state.user);
  const { data: folderTree } = useFolderTree();
  const { data: groups } = useGroups();
  const { mutateAsync, isPending, error } = useEnqueueReport();

  const flatFolders = flattenFolderTree(folderTree);

  const { control, handleSubmit, watch, setValue } = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      type: CreateReportDtoType.user,
      format: CreateReportDtoFormat.csv,
      subjectId: user?.id ?? '',
      from: '',
      to: '',
    },
  });

  const reportType = watch('type');
  const showDateRange = reportType !== CreateReportDtoType.group;
  const showFolderSelect = reportType === CreateReportDtoType.folder;
  const showGroupSelect = reportType === CreateReportDtoType.group;

  const handleTypeChange = (newType: CreateReportFormValues['type']) => {
    if (newType === CreateReportDtoType.user) {
      setValue('subjectId', user?.id ?? '');
    } else {
      setValue('subjectId', '');
    }
  };

  const onSubmit = async (values: CreateReportFormValues) => {
    const result = await mutateAsync({
      data: {
        type: values.type,
        format: values.format,
        subjectId: values.type === CreateReportDtoType.user ? (user?.id ?? values.subjectId) : values.subjectId,
        from: values.from || undefined,
        to: values.to || undefined,
      },
    });
    onJobCreated(result);
  };

  return (
    <FormRoot gap={2}>
      <Typography variant={'h6'}>Создать отчёт</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={'type'}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={'report-type-label'}>Тип</InputLabel>
                <Select
                  {...field}
                  labelId={'report-type-label'}
                  label={'Тип'}
                  onChange={(event) => {
                    field.onChange(event);
                    handleTypeChange(event.target.value as CreateReportFormValues['type']);
                  }}
                >
                  <MenuItem value={CreateReportDtoType.user}>Пользователь</MenuItem>
                  <MenuItem value={CreateReportDtoType.folder}>Папка</MenuItem>
                  <MenuItem value={CreateReportDtoType.group}>Группа</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={'format'}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={'report-format-label'}>Формат</InputLabel>
                <Select {...field} labelId={'report-format-label'} label={'Формат'}>
                  <MenuItem value={CreateReportDtoFormat.csv}>CSV</MenuItem>
                  <MenuItem value={CreateReportDtoFormat.pdf}>PDF</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {showFolderSelect && (
          <Grid size={12}>
            <Controller
              name={'subjectId'}
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel id={'folder-label'}>Папка</InputLabel>
                  <Select {...field} labelId={'folder-label'} label={'Папка'}>
                    {flatFolders.map((folder) => (
                      <MenuItem key={folder.id} value={folder.id}>
                        <FolderMenuItemLabel>{folder.label}</FolderMenuItemLabel>
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant={'caption'} color={'error'} mt={0.5}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        )}

        {showGroupSelect && (
          <Grid size={12}>
            <Controller
              name={'subjectId'}
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel id={'group-label'}>Группа</InputLabel>
                  <Select {...field} labelId={'group-label'} label={'Группа'}>
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant={'caption'} color={'error'} mt={0.5}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        )}

        {showDateRange && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name={'from'}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={'Дата с'}
                    type={'date'}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name={'to'}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={'Дата по'}
                    type={'date'}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>

      {error && <Alert severity={'error'}>{getApiErrorMessage(error)}</Alert>}

      <Button variant={'contained'} loading={isPending} onClick={handleSubmit(onSubmit)}>
        Создать отчёт
      </Button>
    </FormRoot>
  );
};

const FormRoot = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const FolderMenuItemLabel = styled('span')({
  fontFamily: 'monospace',
  whiteSpace: 'pre',
});
