import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { STORAGE_KEYS } from '../constants/storage';

export interface BookmarkItem {
    id: string;
    name: string;
    mimeType: string;
    bookmarkedAt: string;
    folderPath: string[];
}

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(false);

    const loadBookmarks = async () => {
        try {
            setLoading(true);
            const stored = await SecureStore.getItemAsync(STORAGE_KEYS.BOOKMARKS);
            if (stored) {
                setBookmarks(JSON.parse(stored));
            } else {
                setBookmarks([]);
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            setBookmarks([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadBookmarks();
        }, [])
    );

    const saveBookmarks = async (newBookmarks: BookmarkItem[]) => {
        try {
            await SecureStore.setItemAsync(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
            setBookmarks(newBookmarks);
        } catch (error) {
            console.error('Error saving bookmarks:', error);
            Alert.alert('Error', 'Failed to save bookmark');
        }
    };

    const toggleBookmark = (item: { id: string; name: string; mimeType: string; folderPath?: string[] }) => {
        const isBookmarked = bookmarks.some(b => b.id === item.id);
        let newBookmarks: BookmarkItem[];
        
        if (isBookmarked) {
            newBookmarks = bookmarks.filter(b => b.id !== item.id);
        } else {
            const bookmarkItem: BookmarkItem = {
                id: item.id,
                name: item.name,
                mimeType: item.mimeType,
                bookmarkedAt: new Date().toISOString(),
                folderPath: item.folderPath || ['Root']
            };
            newBookmarks = [...bookmarks, bookmarkItem];
        }
        saveBookmarks(newBookmarks);
    };

    const isBookmarked = (itemId: string): boolean => {
        return bookmarks.some(b => b.id === itemId);
    };

    const removeBookmark = async (id: string) => {
        try {
            const newBookmarks = bookmarks.filter(b => b.id !== id);
            await SecureStore.setItemAsync(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
            setBookmarks(newBookmarks);
        } catch (error) {
            console.error('Error removing bookmark:', error);
            Alert.alert('Error', 'Failed to remove bookmark');
        }
    };

    const clearAllBookmarks = async () => {
        Alert.alert(
            'Clear All Bookmarks',
            'Are you sure you want to remove all bookmarks?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await SecureStore.setItemAsync(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
                            setBookmarks([]);
                        } catch (error) {
                            console.error('Error clearing bookmarks:', error);
                            Alert.alert('Error', 'Failed to clear bookmarks');
                        }
                    }
                }
            ]
        );
    };

    return {
        bookmarks,
        loading,
        loadBookmarks,
        toggleBookmark,
        isBookmarked,
        removeBookmark,
        clearAllBookmarks
    };
};