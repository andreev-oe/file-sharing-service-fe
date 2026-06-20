export interface FileRecord {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  folderId: string | null;
  uploadedAt: string;
  version: number;
}

export interface FileVersion {
  version: number;
  size: number;
  uploadedAt: string;
}
