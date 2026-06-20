import { FormControl, InputLabel, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import type { CreatePermissionDtoPermission } from '@/api/generated/types';
import { CreatePermissionDtoPermission as PermissionLevel } from '@/api/generated/types';

type LevelMeta = {
  label: string;
  description: string;
};

const LEVEL_META: Record<CreatePermissionDtoPermission, LevelMeta> = {
  [PermissionLevel.VIEW]: { label: 'Просмотр', description: 'Только чтение файлов и папок' },
  [PermissionLevel.COMMENT]: { label: 'Комментирование', description: 'Просмотр и добавление заметок' },
  [PermissionLevel.EDIT]: { label: 'Редактирование', description: 'Загрузка, переименование и перемещение файлов' },
  [PermissionLevel.MANAGE]: { label: 'Управление', description: 'Полный контроль, включая права доступа' },
};

const PERMISSION_LEVELS: CreatePermissionDtoPermission[] = [
  PermissionLevel.VIEW,
  PermissionLevel.COMMENT,
  PermissionLevel.EDIT,
  PermissionLevel.MANAGE,
];

export type PermissionLevelSelectProps = {
  value: CreatePermissionDtoPermission;
  onChange: (value: CreatePermissionDtoPermission) => void;
  disabled?: boolean;
};

export const PermissionLevelSelect = ({ value, onChange, disabled }: PermissionLevelSelectProps) => {
  const handleChange = (event: SelectChangeEvent<CreatePermissionDtoPermission>) => {
    onChange(event.target.value as CreatePermissionDtoPermission);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={'permission-level-label'}>Уровень доступа</InputLabel>
      <Select<CreatePermissionDtoPermission>
        labelId={'permission-level-label'}
        value={value}
        label={'Уровень доступа'}
        onChange={handleChange}
        disabled={disabled}
        renderValue={(selected) => LEVEL_META[selected].label}
      >
        {PERMISSION_LEVELS.map((level) => (
          <MenuItem key={level} value={level}>
            <ListItemText
              primary={LEVEL_META[level].label}
              secondary={<LevelDescription>{LEVEL_META[level].description}</LevelDescription>}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const LevelDescription = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
}));
