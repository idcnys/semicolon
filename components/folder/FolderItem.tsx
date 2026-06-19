import { Bookmark, File, Folder } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { isFolder } from '../../scripts/driveApi';
import { getFileTypeDisplay } from '../../scripts/fileHelpers';
import { DriveItem } from '../../types/drive';

interface Props {
    item: DriveItem;
    isBookmarked: boolean;
    onPress: (item: DriveItem) => void;
    onBookmarkToggle: (item: DriveItem) => void;
}

export const FolderItem: React.FC<Props> = ({ 
    item, 
    isBookmarked, 
    onPress, 
    onBookmarkToggle 
}) => {
    const folderType = isFolder(item.mimeType);
    const fileTypeDisplay = getFileTypeDisplay(item.mimeType, item.name);

    return (
        <TouchableOpacity style={styles.itemRow} onPress={() => onPress(item)}>
            <View style={styles.iconContainer}>
                {folderType ? (
                    <Folder size={24} color="#4285F4" fill="#4285F4" fillOpacity={0.2} />
                ) : (
                    <File size={24} color="#5f6368" />
                )}
            </View>
            <Text style={styles.itemText} numberOfLines={1}>{item.name}</Text>
            {!folderType && (
                <TouchableOpacity 
                    onPress={(e) => {
                        e.stopPropagation();
                        onBookmarkToggle(item);
                    }} 
                    style={styles.bookmarkButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Bookmark 
                        size={20} 
                        color={isBookmarked ? "#4285F4" : "#9aa0a6"}
                        fill={isBookmarked ? "#4285F4" : "none"}
                    />
                </TouchableOpacity>
            )}
            <View style={styles.fileTypeBadge}>
                <Text style={styles.fileTypeText}>{fileTypeDisplay}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 14, 
        paddingHorizontal: 4 
    },
    iconContainer: { 
        marginRight: 14 
    },
    itemText: { 
        fontSize: 16, 
        color: '#3c4043', 
        flex: 1 
    },
    bookmarkButton: {
        padding: 4,
        marginRight: 8,
    },
    fileTypeBadge: { 
        backgroundColor: '#e8eaed', 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 4, 
        marginLeft: 8 
    },
    fileTypeText: { 
        fontSize: 10, 
        color: '#5f6368', 
        fontWeight: 'bold' 
    },
});