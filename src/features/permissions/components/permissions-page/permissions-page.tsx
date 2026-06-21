import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PublicIcon from '@mui/icons-material/Public';
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

import { useGroupsControllerFindAll } from '@/api/generated/endpoints/groups/groups';
import { useUsersControllerFindAll } from '@/api/generated/endpoints/users/users';
import {
  PermissionDtoPermission as PermissionLevel,
  PermissionDtoResourceType as ResourceType,
  PermissionsControllerListSubjectType as SubjectType,
} from '@/api/generated/types';
import type { GroupDto, PermissionDto, UserPublicDto } from '@/api/generated/types';
import { formatDate } from '@/utils/format.utils';

import { usePermissions } from '../../hooks/use-permissions';
import { useResourceNames } from '../../hooks/use-resource-names';
import { useRevokePermission } from '../../hooks/use-revoke-permission';

const PERMISSION_LABEL: Record<PermissionLevel, string> = {
  [PermissionLevel.VIEW]: 'Просмотр',
  [PermissionLevel.COMMENT]: 'Комментирование',
  [PermissionLevel.EDIT]: 'Редактирование',
  [PermissionLevel.MANAGE]: 'Управление',
};

const PERMISSION_COLOR: Record<PermissionLevel, 'default' | 'primary' | 'warning' | 'error'> = {
  [PermissionLevel.VIEW]: 'default',
  [PermissionLevel.COMMENT]: 'default',
  [PermissionLevel.EDIT]: 'primary',
  [PermissionLevel.MANAGE]: 'error',
};

const SKELETON_COUNT = 5;

type SubjectMode = 'user' | 'group' | 'everyone';

type PermissionRowProps = {
  permission: PermissionDto;
  resourceName: string | undefined;
};

const PermissionTableRow = ({ permission, resourceName }: PermissionRowProps) => {
  const { mutate: revoke, isPending } = useRevokePermission();
  const isFile = permission.resourceType === ResourceType.file;
  const ResourceIcon = isFile ? InsertDriveFileIcon : FolderIcon;

  const handleRevoke = () => {
    revoke({ id: permission.id });
  };

  return (
    <TableRow>
      <TableCell width={40}>
        <ResourceTypeIcon as={ResourceIcon} $isFile={isFile} />
      </TableCell>
      <TableCell>
        <Tooltip title={permission.resourceId}>
          <Typography variant={'body2'} noWrap>
            {resourceName ?? `${permission.resourceId.slice(0, 8)}…`}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell width={120}>
        <Typography variant={'body2'} color={'text.secondary'}>
          {isFile ? 'Файл' : 'Папка'}
        </Typography>
      </TableCell>
      <TableCell width={180}>
        <PermissionChip
          label={PERMISSION_LABEL[permission.permission]}
          size={'small'}
          variant={'outlined'}
          color={PERMISSION_COLOR[permission.permission]}
        />
      </TableCell>
      <TableCell width={200}>
        <Typography variant={'body2'} color={'text.secondary'} noWrap>
          {formatDate(new Date(permission.createdAt).getTime())}
        </Typography>
      </TableCell>
      <TableCell width={48} padding={'none'}>
        <Tooltip title={'Отозвать доступ'}>
          <span>
            <IconButton size={'small'} color={'error'} disabled={isPending} onClick={handleRevoke}>
              <DeleteIcon fontSize={'small'} />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export const PermissionsPage = () => {
  const [subjectMode, setSubjectMode] = useState<SubjectMode>('user');
  const [selectedUser, setSelectedUser] = useState<UserPublicDto | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupDto | null>(null);

  const { data: users, isLoading: isUsersLoading } = useUsersControllerFindAll();
  const { data: groups, isLoading: isGroupsLoading } = useGroupsControllerFindAll();

  const subjectId = subjectMode === 'user' ? selectedUser?.id : subjectMode === 'group' ? selectedGroup?.id : undefined;
  const isQueryEnabled = subjectMode === 'everyone' || subjectId !== undefined;

  const { data: permissions, isLoading: isPermissionsLoading } = usePermissions(
    { subjectType: subjectMode, subjectId },
    isQueryEnabled,
  );

  const resourceNameById = useResourceNames(permissions);

  const handleSubjectModeChange = (_event: React.SyntheticEvent, newMode: SubjectMode | null) => {
    if (newMode === null) {
      return;
    }
    setSubjectMode(newMode);
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const showEmptyPicker = subjectMode !== 'everyone' && subjectId === undefined;
  const showPermissions = isQueryEnabled && !isPermissionsLoading;

  return (
    <PageRoot>
      <PageHeader>
        <Typography variant={'h5'} fontWeight={600}>
          Управление доступом
        </Typography>
      </PageHeader>

      <FiltersRow>
        <ToggleButtonGroup value={subjectMode} exclusive onChange={handleSubjectModeChange} size={'small'}>
          <ToggleButton value={'user'}>Пользователи</ToggleButton>
          <ToggleButton value={'group'}>Группы</ToggleButton>
          <ToggleButton value={'everyone'}>
            <PublicIcon fontSize={'small'} />
            &nbsp;Для всех
          </ToggleButton>
        </ToggleButtonGroup>

        {subjectMode === SubjectType.user && (
          <Autocomplete<UserPublicDto>
            options={users ?? []}
            loading={isUsersLoading}
            value={selectedUser}
            getOptionLabel={(option) => `${option.name} (@${option.username})`}
            filterOptions={(options, state) => {
              const query = state.inputValue.toLowerCase();
              return options.filter(
                (option) => option.name.toLowerCase().includes(query) || option.username.toLowerCase().includes(query),
              );
            }}
            onChange={(_event, value) => {
              setSelectedUser(value);
            }}
            renderOption={(props, option) => (
              <ListItem {...props} key={option.id}>
                <ListItemAvatar>
                  <Avatar src={option.avatarUrl ?? undefined} alt={option.name}>
                    {option.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={option.name} secondary={`@${option.username}`} />
              </ListItem>
            )}
            renderInput={(params) => <SubjectAutocompleteInput {...params} label={'Пользователь'} size={'small'} />}
            noOptionsText={'Пользователи не найдены'}
            loadingText={'Загрузка...'}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        )}

        {subjectMode === SubjectType.group && (
          <Autocomplete<GroupDto>
            options={groups ?? []}
            loading={isGroupsLoading}
            value={selectedGroup}
            getOptionLabel={(option) => option.name}
            filterOptions={(options, state) => {
              const query = state.inputValue.toLowerCase();
              return options.filter((option) => option.name.toLowerCase().includes(query));
            }}
            onChange={(_event, value) => {
              setSelectedGroup(value);
            }}
            renderOption={(props, option) => (
              <ListItem {...props} key={option.id}>
                <ListItemText primary={option.name} secondary={option.description ?? undefined} />
              </ListItem>
            )}
            renderInput={(params) => <SubjectAutocompleteInput {...params} label={'Группа'} size={'small'} />}
            noOptionsText={'Группы не найдены'}
            loadingText={'Загрузка...'}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        )}
      </FiltersRow>

      {showEmptyPicker && (
        <EmptyState>
          <LockOpenIcon fontSize={'inherit'} />
          <Typography variant={'h6'} color={'text.secondary'} fontWeight={400}>
            {subjectMode === SubjectType.user ? 'Выберите пользователя' : 'Выберите группу'}
          </Typography>
          <Typography variant={'body2'} color={'text.secondary'}>
            {subjectMode === SubjectType.user
              ? 'Чтобы увидеть разрешения, выберите пользователя из списка выше'
              : 'Чтобы увидеть разрешения, выберите группу из списка выше'}
          </Typography>
        </EmptyState>
      )}

      {isQueryEnabled && isPermissionsLoading && (
        <Table size={'small'}>
          <TableHead>
            <PermissionTableHead />
          </TableHead>
          <TableBody>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant={'circular'} width={20} height={20} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'40%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={60} />
                </TableCell>
                <TableCell>
                  <Skeleton width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'60%'} />
                </TableCell>
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {showPermissions && permissions.length === 0 && (
        <EmptyState>
          <LockOpenIcon fontSize={'inherit'} />
          <Typography variant={'h6'} color={'text.secondary'} fontWeight={400}>
            Нет разрешений
          </Typography>
          <Typography variant={'body2'} color={'text.secondary'}>
            {subjectMode === SubjectType.everyone
              ? 'Публичный доступ ни к каким ресурсам не выдан'
              : 'Этому субъекту не выдан доступ ни к одному ресурсу'}
          </Typography>
        </EmptyState>
      )}

      {showPermissions && permissions.length > 0 && (
        <Table size={'small'}>
          <TableHead>
            <PermissionTableHead />
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <PermissionTableRow
                key={permission.id}
                permission={permission}
                resourceName={resourceNameById.get(permission.resourceId)}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </PageRoot>
  );
};

const PermissionTableHead = () => (
  <TableRow>
    <TableCell width={40} />
    <TableCell>Ресурс</TableCell>
    <TableCell width={120}>Тип</TableCell>
    <TableCell width={180}>Уровень доступа</TableCell>
    <TableCell width={200}>Дата выдачи</TableCell>
    <TableCell width={48} padding={'none'} />
  </TableRow>
);

const PageRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const PageHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const FiltersRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

const SubjectAutocompleteInput = styled(TextField)({
  minWidth: 280,
});

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  gap: theme.spacing(1),
  fontSize: 72,
  color: theme.palette.primary.light,
}));

const ResourceTypeIcon = styled(InsertDriveFileIcon, {
  shouldForwardProp: (prop) => prop !== '$isFile',
})<{ $isFile: boolean }>(({ theme, $isFile }) => ({
  fontSize: 20,
  display: 'block',
  color: $isFile ? theme.palette.primary.main : theme.palette.warning.main,
}));

const PermissionChip = styled(Chip)({
  fontSize: 11,
  height: 22,
});
