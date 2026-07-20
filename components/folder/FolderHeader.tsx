import { ChevronRight, Home } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';

import { useBookmarks } from '../../hooks/useBookmarks';


interface Props {
    title: string;
    folderStack: string[];
    folderNames: Record<string, string>;
    onBreadcrumbPress: (index: number) => void;
        onOpenBookmarks?: () => void;
    onToggleEdit?: () => void;
    editMode?: boolean;
    showEditButton?: boolean;
}

export const FolderHeader: React.FC<Props> = ({ 
    title, 
    folderStack, 
    folderNames, 
    onBreadcrumbPress,
    onOpenBookmarks,
    onToggleEdit,
    editMode
    , showEditButton = true
}) => {
    const breadcrumbScrollViewRef = useRef<ScrollView>(null);
    const { bookmarks } = useBookmarks();
    const bookmarkCount = bookmarks ? bookmarks.length : 0;
    const displayTitle = title ? (title.split(' ')[0] + (title.includes(' ') ? '...' : '')) : '';

    useEffect(() => {
        breadcrumbScrollViewRef.current?.scrollToEnd({ animated: true });
    }, [folderStack]);

    return (
        <View style={styles.header}>
            <View style={styles.topRow}>
                <Text style={styles.title} numberOfLines={1}>
                    {displayTitle}
                </Text>
                <View style={styles.headerActionsRow}>
                    {onToggleEdit && showEditButton && (
                        <TouchableOpacity onPress={() => onToggleEdit && onToggleEdit()} style={styles.editButton}>
                            <Text style={styles.editButtonText}>{editMode ? 'Save' : 'Edit'}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => onOpenBookmarks && onOpenBookmarks()}
                        style={styles.bookmarkButton}
                    >
                        <Image
                            source={require('../../assets/icons/bookmark.png')}
                            style={styles.bookmarkIcon}
                        />
                        {bookmarkCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{bookmarkCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                horizontal
                ref={breadcrumbScrollViewRef}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.breadcrumbContainer}
            >
                <TouchableOpacity onPress={() => onBreadcrumbPress(-1)} style={styles.crumbTouch}>
                    <Home size={16} color={folderStack.length === 0 ? '#5f6368' : '#1a73e8'} />
                </TouchableOpacity>
                {folderStack.map((folderId, index) => {
                    const isLast = index === folderStack.length - 1;
                    return (
                        <View key={folderId} style={styles.crumbWrapper}>
                            <ChevronRight size={14} color="#9aa0a6" style={styles.crumbSeparator} />
                            <TouchableOpacity 
                                onPress={() => onBreadcrumbPress(index)} 
                                disabled={isLast} 
                                style={styles.crumbTouch}
                            >
                                <Text style={[styles.crumbText, isLast && styles.activeCrumbText]}>
                                    {folderNames[folderId] || 'Folder'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { 
        paddingHorizontal: 16, 
        paddingTop: 24, 
        paddingBottom: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#e8eaed', 
        backgroundColor: '#fff' 
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#202124', 
        marginBottom: 8 
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bookmarkButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: 'transparent'
    },
    bookmarkIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
        tintColor: '#1a73e8'
    },
    headerActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    editButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#f1f3f4',
    },
    editButtonText: {
        color: '#1a73e8',
        fontWeight: '600'
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 9,
        backgroundColor: '#FF3B30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    breadcrumbContainer: { 
        alignItems: 'center', 
        paddingVertical: 4, 
        flexDirection: 'row' 
    },
    crumbWrapper: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    crumbTouch: { 
        paddingVertical: 4, 
        paddingHorizontal: 2, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    crumbText: { 
        fontSize: 14, 
        color: '#1a73e8', 
        fontWeight: '500' 
    },
    activeCrumbText: { 
        color: '#5f6368', 
        fontWeight: 'normal' 
    },
    crumbSeparator: { 
        marginHorizontal: 2 
    },
});