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
        borderRadius: 10,
        padding: 12,
        borderWidth: 0.5,
        borderColor: '#e8eaed',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    bookmarkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    fileIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#e8f0fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    bookmarkInfo: {
        flex: 1,
    },
    bookmarkName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#202124',
        marginBottom: 2,
    },
    pathContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    bookmarkPath: {
        fontSize: 12,
        color: '#5f6368',
        flex: 1,
    },
    bookmarkFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f7f7f8',
        paddingTop: 8,
    },
    bookmarkMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    fileTypeBadge: {
        backgroundColor: '#eef2ff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 10,
        color: '#4b5563',
        fontWeight: '600',
        overflow: 'hidden',
    },
    bookmarkDate: {
        fontSize: 11,
        color: '#9aa0a6',
    },
    removeButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#f1f3f4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        fontSize: 13,
        color: '#5f6368',
        fontWeight: '600',
        lineHeight: 14,
        textAlign: 'center',
    },
});