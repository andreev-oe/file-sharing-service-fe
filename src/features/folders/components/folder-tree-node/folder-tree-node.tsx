import FolderIcon from '@mui/icons-material/Folder';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/config/paths';
import type { FolderNode } from '@/types/folders';
import { formatFileSize } from '@/utils/format.utils';

export type FolderTreeNodeProps = {
  node: FolderNode;
  onContextMenu: (event: React.MouseEvent, node: FolderNode) => void;
};

export const FolderTreeNode = ({ node, onContextMenu }: FolderTreeNodeProps) => {
  const navigate = useNavigate();

  const handleLabelClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(paths.folder.getHref(node.id));
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onContextMenu(event, node);
  };

  const label = (
    <NodeLabel onContextMenu={handleContextMenu} onClick={handleLabelClick}>
      <NodeFolderIcon />
      <Tooltip title={formatFileSize(node.totalSize)} placement={'right'}>
        <NodeName>{node.name}</NodeName>
      </Tooltip>
    </NodeLabel>
  );

  return (
    <TreeItem itemId={node.id} label={label}>
      {node.children.map((child) => (
        <FolderTreeNode key={child.id} node={child} onContextMenu={onContextMenu} />
      ))}
    </TreeItem>
  );
};

const NodeLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  paddingTop: 2,
  paddingBottom: 2,
});

const NodeFolderIcon = styled(FolderIcon)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

const NodeName = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 13,
});
