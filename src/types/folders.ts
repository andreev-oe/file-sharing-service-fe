export interface FolderNode {
  id: string;
  name: string;
  depth: number;
  totalSize: number;
  children: FolderNode[];
}
