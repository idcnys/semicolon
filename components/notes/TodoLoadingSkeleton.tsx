import React from 'react';
import { StyleSheet, View } from 'react-native';

export const TodoLoadingSkeleton: React.FC = () => {
    return (
        <View style={styles.loadingContainer}>
            <View style={styles.loadingHeader}>
                <View style={styles.loadingGreeting} />
                <View style={styles.loadingButton} />
            </View>
            <View style={styles.loadingSearch} />
            <View style={styles.loadingFilters} />
            <View style={styles.loadingCards}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.loadingCard}>
                        <View style={styles.loadingCardContent} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    loadingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingGreeting: {
        width: 120,
        height: 24,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    loadingButton: {
        width: 44,
        height: 44,
        backgroundColor: '#E5E7EB',
        borderRadius: 22,
    },
    loadingSearch: {
        width: '100%',
        height: 40,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        marginBottom: 12,
    },
    loadingFilters: {
        width: '100%',
        height: 36,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginBottom: 16,
    },
    loadingCards: {
        gap: 12,
    },
    loadingCard: {
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        height: 60,
    },
    loadingCardContent: {
        width: '80%',
        height: 16,
        backgroundColor: '#D1D5DB',
        borderRadius: 4,
    },
});