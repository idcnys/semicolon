import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
    type?: 'dashboard' | 'list';
}

export const FolderLoadingSkeleton: React.FC<Props> = ({ type = 'dashboard' }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmer = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmer.start();

        return () => shimmer.stop();
    }, [shimmerAnim]);

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });

    const ShimmerView = ({ style }: { style: any }) => (
        <View style={[styles.shimmerBase, style]}>
            <Animated.View
                style={[
                    styles.shimmerOverlay,
                    {
                        transform: [{ translateX: shimmerTranslate }],
                    },
                ]}
            />
        </View>
    );

    if (type === 'dashboard') {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.container}>
                    <View style={styles.headerShimmer}>
                        <View style={styles.headerTop}>
                            <ShimmerView style={styles.headerTitle} />
                            <ShimmerView style={styles.headerIcon} />
                        </View>
                        <ShimmerView style={styles.headerSubtitle} />
                    </View>

                    <ScrollView contentContainerStyle={styles.dashboardContainer}>
                        <ShimmerView style={styles.sectionTitle} />
                        <View style={styles.cardGrid}>
                            {[1, 2, 3, 4].map((i) => (
                                <View key={i} style={styles.cardWrapper}>
                                    <ShimmerView style={styles.folderCard} />
                                    <ShimmerView style={styles.cardTitle} />
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }

    // List type skeleton
    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.headerShimmer}>
                    <View style={styles.headerTop}>
                        <ShimmerView style={styles.headerTitle} />
                        <ShimmerView style={styles.headerIcon} />
                    </View>
                    <ShimmerView style={styles.headerSubtitle} />
                </View>

                <View style={styles.listContainer}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <View key={i}>
                            <View style={styles.listItem}>
                                <ShimmerView style={styles.listIcon} />
                                <View style={styles.listContent}>
                                    <ShimmerView style={styles.listTitle} />
                                    <ShimmerView style={styles.listSubtitle} />
                                </View>
                                <ShimmerView style={styles.listAction} />
                            </View>
                            {i < 6 && <View style={styles.separator} />}
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerShimmer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e8eaed',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        width: 140,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#e8eaed',
    },
    headerIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#e8eaed',
    },
    headerSubtitle: {
        width: 200,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#e8eaed',
    },
    dashboardContainer: {
        padding: 16,
    },
    sectionTitle: {
        width: 140,
        height: 18,
        borderRadius: 4,
        backgroundColor: '#e8eaed',
        marginBottom: 16,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48%',
        marginBottom: 16,
    },
    folderCard: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        backgroundColor: '#e8eaed',
        marginBottom: 8,
    },
    cardTitle: {
        width: '80%',
        height: 16,
        borderRadius: 4,
        backgroundColor: '#e8eaed',
        alignSelf: 'center',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    listIcon: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#e8eaed',
        marginRight: 12,
    },
    listContent: {
        flex: 1,
        gap: 6,
    },
    listTitle: {
        width: '70%',
        height: 16,
        borderRadius: 4,
        backgroundColor: '#e8eaed',
    },
    listSubtitle: {
        width: '50%',
        height: 14,
        borderRadius: 4,
        backgroundColor: '#e8eaed',
    },
    listAction: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e8eaed',
    },
    separator: {
        height: 1,
        backgroundColor: '#f1f3f4',
        marginLeft: 44,
    },
    shimmerBase: {
        overflow: 'hidden',
        position: 'relative',
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 4,
    },
});