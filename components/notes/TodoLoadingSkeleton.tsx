import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export const TodoLoadingSkeleton: React.FC = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainerBody}>
                <View style={styles.loadingCards}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <View key={i} style={styles.loadingCard}>
                            <View style={styles.loadingCardContent} />
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainerBody: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingTop: 12,
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