import { Bookmark } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const BookmarkEmptyState: React.FC = () => {
    return (
        <View style={styles.emptyContainer}>
            <Bookmark size={80} color="#dadce0" />
            <Text style={styles.emptyTitle}>No Bookmarks</Text>
            <Text style={styles.emptySubtitle}>
                Bookmark your favorite files to access them quickly
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#202124',
        marginBottom: 8,
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#5f6368',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
});