import { RootFolder } from '../types/drive';

export const API_KEY = process.env.EXPO_PUBLIC_DRIVE_ID_API_KEY;
export const DRIVE_IDS_URL = process.env.EXPO_PUBLIC_DB_URL;

// Function to fetch root folders dynamically
export const ROOT_FOLDERS = async (): Promise<RootFolder[]> => {
    try {
        const response = await fetch(DRIVE_IDS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the Firebase data into RootFolder array
        const folders: RootFolder[] = Object.values(data).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description
        }));
        
        return folders;
    } catch (error) {
        console.error('Error fetching root folders:', error);
        throw error;
    }
};