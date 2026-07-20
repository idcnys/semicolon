import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { ROOT_FOLDERS } from '../constants/drive';
import { FOLDER_PREFS_KEY } from '../constants/storage';
import { fetchDriveContents } from '../scripts/driveApi';
import { DriveItem, RootFolder } from '../types/drive';

export const useFolderNavigation = () => {
    const [folderStack, setFolderStack] = useState<string[]>([]);
    const [folderNames, setFolderNames] = useState<Record<string, string>>({});
    const [items, setItems] = useState<DriveItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rootFolders, setRootFolders] = useState<RootFolder[]>([]);
    const [rootFoldersLoading, setRootFoldersLoading] = useState(true);
    const [rootFoldersError, setRootFoldersError] = useState<string | null>(null);

    const currentFolderId = folderStack.length > 0 ? folderStack[folderStack.length - 1] : null;

    // Fetch root folders and initialize folder names
    useEffect(() => {
        const initializeRootFolders = async () => {
            try {
                setRootFoldersLoading(true);
                const folders = await ROOT_FOLDERS();

                // Load saved prefs (order + pinned)
                const prefsRaw = await SecureStore.getItemAsync(FOLDER_PREFS_KEY);
                let prefs: { order?: string[]; pinned?: string[] } | null = null;
                if (prefsRaw) {
                    try { prefs = JSON.parse(prefsRaw); } catch (e) { prefs = null; }
                }

                let ordered = folders.slice();
                if (prefs && prefs.order && prefs.order.length > 0) {
                    // Reorder according to prefs.order, keep unknowns appended
                    const byId = Object.fromEntries(folders.map(f => [f.id, f]));
                    ordered = prefs.order.map(id => byId[id]).filter(Boolean) as RootFolder[];
                    const remaining = folders.filter(f => !prefs!.order!.includes(f.id));
                    ordered = [...ordered, ...remaining];
                }

                // Apply pinned flag
                const pinnedSet = new Set(prefs && prefs.pinned ? prefs.pinned : []);
                const merged = ordered.map(f => ({ ...f, pinned: pinnedSet.has(f.id) } as any));

                setRootFolders(merged as RootFolder[] & any);

                // Initialize folder names with root folders
                const initialMap: Record<string, string> = {};
                folders.forEach(f => { initialMap[f.id] = f.name; });
                setFolderNames(initialMap);

                setRootFoldersError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load root folders';
                setRootFoldersError(errorMessage);
                console.error('Error fetching root folders:', err);
            } finally {
                setRootFoldersLoading(false);
            }
        };

        initializeRootFolders();
    }, []);

    // Fetch contents when folder changes
    useEffect(() => {
        const loadContents = async () => {
            if (currentFolderId) {
                try {
                    setLoading(true);
                    setError(null);
                    const fetchedItems = await fetchDriveContents(currentFolderId);
                    setItems(fetchedItems);
                } catch (err: any) {
                    setError(err.message || 'Something went wrong.');
                    setItems([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setItems([]);
                setLoading(false);
                setError(null);
            }
        };
        loadContents();
    }, [currentFolderId]);

    // Handle back button
    useEffect(() => {
        const onBackPress = () => {
            if (folderStack.length > 0) {
                goBack();
                return true;
            }
            return false;
        };
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [folderStack]);

    const navigateToFolder = (folderId: string, folderName: string) => {
        setFolderNames(prev => ({ ...prev, [folderId]: folderName }));
        setFolderStack(prev => [...prev, folderId]);
    };

    const goBack = () => {
        setFolderStack(prev => prev.slice(0, -1));
    };

    const navigateToRoot = (folderId: string) => {
        setFolderStack([folderId]);
    };

    const navigateToBreadcrumb = (index: number) => {
        if (index === -1) {
            setFolderStack([]);
        } else {
            setFolderStack(prev => prev.slice(0, index + 1));
        }
    };

    const resetToRoot = () => {
        setFolderStack([]);
    };

    const refreshRootFolders = async () => {
        try {
            setRootFoldersLoading(true);
            const folders = await ROOT_FOLDERS();

            // Load prefs and reapply order/pins similarly to initialize
            const prefsRaw = await SecureStore.getItemAsync(FOLDER_PREFS_KEY);
            let prefs: { order?: string[]; pinned?: string[] } | null = null;
            if (prefsRaw) {
                try { prefs = JSON.parse(prefsRaw); } catch (e) { prefs = null; }
            }

            let ordered = folders.slice();
            if (prefs && prefs.order && prefs.order.length > 0) {
                const byId = Object.fromEntries(folders.map(f => [f.id, f]));
                ordered = prefs.order.map(id => byId[id]).filter(Boolean) as RootFolder[];
                const remaining = folders.filter(f => !prefs!.order!.includes(f.id));
                ordered = [...ordered, ...remaining];
            }
            const pinnedSet = new Set(prefs && prefs.pinned ? prefs.pinned : []);
            const merged = ordered.map(f => ({ ...f, pinned: pinnedSet.has(f.id) } as any));

            setRootFolders(merged as RootFolder[] & any);

            // Update folder names with fresh data
            const updatedMap: Record<string, string> = {};
            folders.forEach(f => { updatedMap[f.id] = f.name; });
            setFolderNames(prev => ({ ...prev, ...updatedMap }));

            setRootFoldersError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load root folders';
            setRootFoldersError(errorMessage);
            console.error('Error refreshing root folders:', err);
        } finally {
            setRootFoldersLoading(false);
        }
    };

    const persistPrefs = async (foldersList: RootFolder[] & any) => {
        try {
            const order = foldersList.map(f => f.id);
            const pinned = foldersList.filter((f:any) => f.pinned).map((f:any) => f.id);
            await SecureStore.setItemAsync(FOLDER_PREFS_KEY, JSON.stringify({ order, pinned }));
        } catch (e) {
            console.error('Failed to persist folder prefs', e);
        }
    };

    const reorderRootFolders = async (fromIndex: number, toIndex: number) => {
        setRootFolders(prev => {
            const next = prev.slice();
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            persistPrefs(next);
            return next;
        });
    };

    const togglePin = async (folderId: string) => {
        setRootFolders(prev => {
            const next = prev.map(f => f.id === folderId ? { ...f, pinned: !((f as any).pinned) } : f);
            // Move pinned folders to front, preserving order among pinned
            next.sort((a:any,b:any) => {
                if (a.pinned === b.pinned) return 0;
                return a.pinned ? -1 : 1;
            });
            persistPrefs(next);
            return next;
        });
    };

    const refresh = () => {
        if (currentFolderId) {
            // Trigger re-fetch by updating a state
            setLoading(true);
            fetchDriveContents(currentFolderId)
                .then(setItems)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        } else {
            // Refresh root folders when at root level
            refreshRootFolders();
        }
    };

    const getRootFolders = () => rootFolders;

    return {
        folderStack,
        folderNames,
        items,
        loading,
        error,
        currentFolderId,
        rootFolders,
        rootFoldersLoading,
        rootFoldersError,
        navigateToFolder,
        goBack,
        navigateToRoot,
        navigateToBreadcrumb,
        resetToRoot,
        setError,
        refresh,
        refreshRootFolders,
        getRootFolders,
        reorderRootFolders,
        togglePin,
        persistFolderPrefs: persistPrefs
    };
};