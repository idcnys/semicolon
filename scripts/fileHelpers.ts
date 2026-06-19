import { FILE_TYPE_MAPPINGS, MIME_TYPES } from '../constants/fileTypes';

// Fix: Use type assertion or check with a helper
export const getFileType = (mimeType: string, fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (mimeType.includes('pdf') || ext === 'pdf') return MIME_TYPES.PDF;
    if (mimeType.includes('image') || FILE_TYPE_MAPPINGS.IMAGE.includes(ext as any)) return MIME_TYPES.IMAGE;
    if (mimeType.includes('video') || FILE_TYPE_MAPPINGS.VIDEO.includes(ext as any)) return MIME_TYPES.VIDEO;
    if (mimeType.includes('audio') || FILE_TYPE_MAPPINGS.AUDIO.includes(ext as any)) return MIME_TYPES.AUDIO;
    
    return MIME_TYPES.FILE;
};

export const getFileTypeDisplay = (mimeType: string, fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (mimeType.includes('pdf') || ext === 'pdf') return 'PDF';
    if (mimeType.includes('image') || FILE_TYPE_MAPPINGS.IMAGE.includes(ext as any)) return 'Image';
    if (mimeType.includes('video') || FILE_TYPE_MAPPINGS.VIDEO.includes(ext as any)) return 'Video';
    if (mimeType.includes('audio') || FILE_TYPE_MAPPINGS.AUDIO.includes(ext as any)) return 'Audio';
    
    return 'File';
};