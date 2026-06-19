import { RootFolder } from '../types/drive';

export const API_KEY = "AIzaSyBFlCCVSdun8DZW1bvQpRZ3bhbTodf0Z7w";
export const DRIVE_IDS_URL = "https://semicolondriveidapi-default-rtdb.europe-west1.firebasedatabase.app/driveIds.json";

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