import ArchiveIcon from '@mui/icons-material/Archive';
import ArticleIcon from '@mui/icons-material/Article';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TableChartIcon from '@mui/icons-material/TableChart';
import VideocamIcon from '@mui/icons-material/Videocam';

const ARCHIVE_MIME_PATTERNS = ['zip', 'rar', 'tar', '7z', 'gz', 'bz2'];
const SPREADSHEET_MIME_PATTERNS = ['spreadsheet', 'excel', 'csv', 'numbers'];
const PRESENTATION_MIME_PATTERNS = ['powerpoint', 'presentation', 'keynote'];
const WORD_MIME_PATTERNS = ['word', 'document', 'pages', 'rtf'];

export const getMimeIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return ImageIcon;
  }
  if (mimeType === 'application/pdf') {
    return PictureAsPdfIcon;
  }
  if (mimeType.startsWith('video/')) {
    return VideocamIcon;
  }
  if (mimeType.startsWith('audio/')) {
    return AudioFileIcon;
  }
  if (
    ARCHIVE_MIME_PATTERNS.some((pattern) => {
      return mimeType.includes(pattern);
    })
  ) {
    return ArchiveIcon;
  }
  if (
    SPREADSHEET_MIME_PATTERNS.some((pattern) => {
      return mimeType.includes(pattern);
    })
  ) {
    return TableChartIcon;
  }
  if (
    PRESENTATION_MIME_PATTERNS.some((pattern) => {
      return mimeType.includes(pattern);
    })
  ) {
    return SlideshowIcon;
  }
  if (
    WORD_MIME_PATTERNS.some((pattern) => {
      return mimeType.includes(pattern);
    })
  ) {
    return ArticleIcon;
  }
  if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('xml')) {
    return DescriptionIcon;
  }
  return InsertDriveFileIcon;
};
