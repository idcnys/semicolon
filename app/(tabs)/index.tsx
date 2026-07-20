import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isFolder } from '../../scripts/driveApi';

// Types
import { DriveItem } from '../../types/drive';

// Hooks
import { useBookmarks } from '../../hooks/useBookmarks';
import { useFolderNavigation } from '../../hooks/useFolderNavigation';

// Components
import BookmarkScreen from '../../components/bookmark/BookmarkScreen';
import { FolderEmptyState } from '../../components/folder/EmptyState';
import { FolderCard } from '../../components/folder/FolderCard';
import { FolderHeader } from '../../components/folder/FolderHeader';
import { FolderItem } from '../../components/folder/FolderItem';
import { FolderLoadingSkeleton } from '../../components/folder/FolderLoadingSkeleton';
import { PreviewModal } from '../../components/folder/PreviewModal';

export default function FolderScreen() {
    const {
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
        navigateToRoot,
        navigateToBreadcrumb,
        refresh,
        refreshRootFolders,
        reorderRootFolders,
        togglePin,
        persistFolderPrefs
    } = useFolderNavigation();

    const { toggleBookmark, isBookmarked } = useBookmarks();

    const [bookmarksVisible, setBookmarksVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const toggleEdit = async () => {
        if (editMode) {
            // saving
            try {
                await persistFolderPrefs(rootFolders as any);
            } catch (e) {
                console.error('Failed to persist on save', e);
            }
        }
        setEditMode(prev => !prev);
    };

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);

    const handlePressItem = (item: DriveItem) => {
        if (isFolder(item.mimeType)) {
            navigateToFolder(item.id, item.name);
        } else {
            setPreviewItem(item);
            setPreviewVisible(true);
        }
    };

    const closePreview = () => {
        setPreviewVisible(false);
        setPreviewItem(null);
    };

    const handleBookmarkToggle = (item: DriveItem) => {
        const currentPath = folderStack.map(id => folderNames[id] || 'Unknown');
        toggleBookmark({
            ...item,
            folderPath: currentPath.length > 0 ? currentPath : ['Root']
        });
    };

    const renderItem = ({ item }: { item: DriveItem }) => (
        <FolderItem
            item={item}
            isBookmarked={isBookmarked(item.id)}
            onPress={handlePressItem}
            onBookmarkToggle={handleBookmarkToggle}
        />
    );

    const getTitle = () => {
        if (!currentFolderId) return 'Shared files';
        return folderNames[currentFolderId] || 'Folder Explorer';
    };

    // Note: keep header visible during root folder refreshes; show loading/error in content only

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <FolderHeader
                    title={getTitle()}
                    folderStack={folderStack}
                    folderNames={folderNames}
                    onBreadcrumbPress={navigateToBreadcrumb}
                    onOpenBookmarks={() => setBookmarksVisible(true)}
                    onToggleEdit={toggleEdit}
                    editMode={editMode}
                    showEditButton={folderStack.length === 0}
                />

                {folderStack.length === 0 ? (
                    rootFoldersLoading ? (
                        <FolderLoadingSkeleton type="dashboard" />
                    ) : rootFoldersError ? (
                        <View style={[styles.container, styles.centerContent]}>
                            <Text style={styles.errorText}>Failed to load directories</Text>
                            <Text style={styles.errorSubText}>{rootFoldersError}</Text>
                            <Text 
                                style={styles.retryText} 
                                onPress={refreshRootFolders}
                            >
                                Tap to retry
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            contentContainerStyle={styles.dashboardContainer}
                            refreshControl={<RefreshControl refreshing={rootFoldersLoading} onRefresh={refreshRootFolders} tintColor="#2563EB" colors={["#2563EB"]} />}
                        >
                            <Text style={styles.sectionTitle}>Select a Directory</Text>
                            <View style={styles.cardGrid}>
                                {rootFolders.map((folder, idx) => (
                                    <FolderCard
                                        key={folder.id}
                                        folder={folder as any}
                                        onPress={() => navigateToRoot(folder.id)}
                                        editMode={editMode}
                                        onMoveUp={idx > 0 ? () => reorderRootFolders(idx, idx - 1) : undefined}
                                        onMoveDown={idx < rootFolders.length - 1 ? () => reorderRootFolders(idx, idx + 1) : undefined}
                                        onPinToggle={(id) => togglePin(id)}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    )
                ) : loading ? (
                    <FolderLoadingSkeleton type="list" />
                ) : error ? (
                    <FolderEmptyState type="error" error={error} onRetry={refresh} />
                ) : items.length === 0 ? (
                    <FolderEmptyState type="empty" />
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}

                <PreviewModal
                    visible={previewVisible}
                    item={previewItem}
                    isBookmarked={previewItem ? isBookmarked(previewItem.id) : false}
                    onClose={closePreview}
                    onBookmarkToggle={handleBookmarkToggle}
                />

                <Modal
                    visible={bookmarksVisible}
                    animationType="slide"
                    onRequestClose={() => setBookmarksVisible(false)}
                >
                    <BookmarkScreen onClose={() => setBookmarksVisible(false)} />
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: { 
        flex: 1, 
        backgroundColor: '#f8f9fa' 
    },
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa' 
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dashboardContainer: { 
        padding: 16 
    },
    sectionTitle: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: '#5f6368', 
        textTransform: 'uppercase', 
        letterSpacing: 0.5, 
        marginBottom: 16 
    },
    cardGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
    },
    listContainer: { 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        backgroundColor: '#fff', 
        flexGrow: 1 
    },
    separator: { 
        height: 1, 
        backgroundColor: '#f1f3f4', 
        marginLeft: 38 
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#d32f2f',
        marginBottom: 8,
    },
    errorSubText: {
        fontSize: 14,
        color: '#5f6368',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryText: {
        fontSize: 16,
        color: '#1a73e8',
        fontWeight: '500',
        padding: 8,
    },
});