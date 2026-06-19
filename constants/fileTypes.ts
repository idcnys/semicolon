export const FILE_TYPE_MAPPINGS = {
    PDF: ['pdf'],
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    VIDEO: ['mp4', 'mov', 'avi', 'mkv'],
    AUDIO: ['mp3', 'wav', 'aac']
} as const;

export const MIME_TYPES = {
    PDF: 'pdf',
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    FILE: 'file'
} as const;