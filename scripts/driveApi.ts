import { API_KEY } from '../constants/drive';
import { DriveItem } from '../types/drive';

export const fetchDriveContents = async (folderId: string): Promise<DriveItem[]> => {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}&fields=files(id,name,mimeType)&orderBy=folder,name`;
    
    const res = await fetch(url);
    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Failed to fetch items.');
    }
    const data = await res.json();
    return data.files || [];
};

export const isFolder = (mimeType: string): boolean => {
    return mimeType === 'application/vnd.google-apps.folder';
};