import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ContestLoadingSkeleton: React.FC = () => {
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

    const ShimmerRow = ({ style }: { style: any }) => (
        <View style={[styles.shimmerRow, style]}>
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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Shimmer */}
            <View style={styles.titleContainer}>
                <View style={styles.titleRow}>
                    <View style={styles.shimmerIcon} />
                    <View style={styles.shimmerTitle} />
                </View>
                <View style={styles.shimmerBadge} />
            </View>

            {/* Contest Cards Shimmer */}
            <View style={styles.listContent}>
                {/* Date Header */}
                <View style={styles.groupContainer}>
                    <View style={styles.shimmerDateHeader} />
                    
                    {/* Card 1 */}
                    <View style={styles.shimmerCard}>
                        <View style={styles.shimmerCardContent}>
                            <View style={styles.shimmerCardHeader}>
                                <View style={styles.shimmerSmallIcon} />
                                <View style={styles.shimmerEventText} />
                                <View style={styles.shimmerChevron} />
                            </View>
                            <View style={styles.shimmerCardDetails}>
                                <View style={styles.shimmerDetailItem} />
                                <View style={styles.shimmerDetailRow}>
                                    <View style={styles.shimmerDetailItem} />
                                    <View style={styles.shimmerDetailItem} />
                                </View>
                            </View>
                            <View style={styles.shimmerCardFooter}>
                                <View style={styles.shimmerStatusBadge} />
                                <View style={styles.shimmerLinkIcon} />
                            </View>
                        </View>
                    </View>

                    {/* Card 2 */}
                    <View style={styles.shimmerCard}>
                        <View style={styles.shimmerCardContent}>
                            <View style={styles.shimmerCardHeader}>
                                <View style={styles.shimmerSmallIcon} />
                                <View style={styles.shimmerEventText} />
                                <View style={styles.shimmerChevron} />
                            </View>
                            <View style={styles.shimmerCardDetails}>
                                <View style={styles.shimmerDetailItem} />
                                <View style={styles.shimmerDetailRow}>
                                    <View style={styles.shimmerDetailItem} />
                                    <View style={styles.shimmerDetailItem} />
                                </View>
                            </View>
                            <View style={styles.shimmerCardFooter}>
                                <View style={styles.shimmerStatusBadge} />
                                <View style={styles.shimmerLinkIcon} />
                            </View>
                        </View>
                    </View>

                    {/* Card 3 */}
                    <View style={styles.shimmerCard}>
                        <View style={styles.shimmerCardContent}>
                            <View style={styles.shimmerCardHeader}>
                                <View style={styles.shimmerSmallIcon} />
                                <View style={styles.shimmerEventText} />
                                <View style={styles.shimmerChevron} />
                            </View>
                            <View style={styles.shimmerCardDetails}>
                                <View style={styles.shimmerDetailItem} />
                                <View style={styles.shimmerDetailRow}>
                                    <View style={styles.shimmerDetailItem} />
                                    <View style={styles.shimmerDetailItem} />
                                </View>
                            </View>
                            <View style={styles.shimmerCardFooter}>
                                <View style={styles.shimmerStatusBadge} />
                                <View style={styles.shimmerLinkIcon} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shimmerIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
    },
    shimmerTitle: {
        width: 160,
        height: 28,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        marginLeft: 8,
    },
    shimmerBadge: {
        width: 55,
        height: 26,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    listContent: {
        padding: 16,
        paddingTop: 12,
    },
    groupContainer: {
        marginBottom: 20,
    },
    shimmerDateHeader: {
        width: 120,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        marginBottom: 12,
    },
    shimmerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    shimmerCardContent: {
        padding: 16,
    },
    shimmerCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    shimmerSmallIcon: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
    },
    shimmerEventText: {
        flex: 1,
        height: 18,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    shimmerChevron: {
        width: 16,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    shimmerCardDetails: {
        gap: 6,
        marginBottom: 12,
    },
    shimmerDetailItem: {
        width: 150,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    shimmerDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
    shimmerCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    shimmerStatusBadge: {
        width: 80,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    shimmerLinkIcon: {
        width: 16,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    shimmerRow: {
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
        borderRadius: 4,
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
    },
});