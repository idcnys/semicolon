import { Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookmarkEmptyState } from '../../components/bookmark/BookmarkEmptyState';
import { BookmarkItem } from '../../components/bookmark/BookmarkItem';
import { PreviewModal } from '../../components/bookmark/PreviewModal';
import { BookmarkItem as BookmarkItemType, useBookmarks } from '../../hooks/useBookmarks';
import { getFileType } from '../../scripts/fileHelpers';

export default function BookmarksScreen() {
    const { bookmarks, loading, removeBookmark, clearAllBookmarks } = useBookmarks();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewItem, setPreviewItem] = useState<BookmarkItemType | null>(null);
    const [previewType, setPreviewType] = useState<string>('');

    const handleBookmarkPress = (item: BookmarkItemType) => {
        const fileType = getFileType(item.mimeType, item.name);
        setPreviewItem(item);
        setPreviewType(fileType);
        setPreviewVisible(true);
    };

    const closePreview = () => {
        setPreviewVisible(false);
        setPreviewItem(null);
        setPreviewType('');
    };

    return (
        <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Bookmarks</Text>
                    {bookmarks.length > 0 && (
                        <TouchableOpacity 
                            onPress={clearAllBookmarks} 
                            style={styles.clearButton}
                        >
                            <Trash2 size={18} color="#EA4335" />
                            <Text style={styles.clearButtonText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.loadingText}>Loading bookmarks...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={bookmarks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <BookmarkItem
                                item={item}
                                onPress={handleBookmarkPress}
                                onRemove={removeBookmark}
                            />
                        )}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={BookmarkEmptyState}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}
            </View>

            <PreviewModal
                visible={previewVisible}
                item={previewItem}
                fileType={previewType}
                onClose={closePreview}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e8eaed',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#202124',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f1f3f4',
        borderRadius: 6,
        gap: 4,
    },
    clearButtonText: {
        fontSize: 14,
        color: '#EA4335',
        fontWeight: '500',
    },
    listContainer: {
        padding: 16,
        flexGrow: 1,
    },
    separator: {
        height: 12,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#5f6368',
    },
});