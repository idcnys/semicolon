import { File, Home, X } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BookmarkItem as BookmarkType } from '../../hooks/useBookmarks';
import { formatDate } from '../../scripts/dateHelpers';
import { getFileTypeDisplay } from '../../scripts/fileHelpers';

interface Props {
    item: BookmarkType;
    onPress: (item: BookmarkType) => void;
    onRemove: (id: string) => void;
}

export const BookmarkItem: React.FC<Props> = ({ item, onPress, onRemove }) => {
    const fileType = getFileTypeDisplay(item.mimeType, item.name);
    const pathDisplay = item.folderPath.length > 0 
        ? item.folderPath.join(' / ') 
        : 'Root';

    return (
        <TouchableOpacity 
            style={styles.bookmarkCard} 
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.bookmarkHeader}>
                <View style={styles.fileIconContainer}>
                    <File size={24} color="#4285F4" />
                </View>
                <View style={styles.bookmarkInfo}>
                    <Text style={styles.bookmarkName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.pathContainer}>
                        <Home size={12} color="#9aa0a6" />
                        <Text style={styles.bookmarkPath} numberOfLines={1}>
                            {pathDisplay}
                        </Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.bookmarkFooter}>
                <View style={styles.bookmarkMeta}>
                    <Text style={styles.fileTypeBadge}>{fileType}</Text>
                    <Text style={styles.bookmarkDate}>
                        {formatDate(item.bookmarkedAt)}
                    </Text>
                </View>
                <TouchableOpacity 
                    onPress={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                    }} 
                    style={styles.removeButton}
                >
                    <X size={16} color="#5f6368" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bookmarkCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e8eaed',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    bookmarkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    fileIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#e8f0fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    bookmarkInfo: {
        flex: 1,
    },
    bookmarkName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#202124',
        marginBottom: 4,
    },
    pathContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    bookmarkPath: {
        fontSize: 13,
        color: '#5f6368',
        flex: 1,
    },
    bookmarkFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f3f4',
        paddingTop: 12,
    },
    bookmarkMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    fileTypeBadge: {
        backgroundColor: '#e8eaed',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 11,
        color: '#5f6368',
        fontWeight: '600',
        overflow: 'hidden',
    },
    bookmarkDate: {
        fontSize: 12,
        color: '#9aa0a6',
    },
    removeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f1f3f4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        fontSize: 14,
        color: '#5f6368',
        fontWeight: '600',
        lineHeight: 14,
        textAlign: 'center',
    },
});