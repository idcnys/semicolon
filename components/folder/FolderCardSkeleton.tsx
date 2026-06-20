import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FolderCardSkeleton: React.FC = () => {
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

    return (
        <View style={styles.cardWrapper}>
            <View style={styles.folderCard}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        {
                            transform: [{ translateX: shimmerTranslate }],
                        },
                    ]}
                />
            </View>
            <View style={styles.cardTitle}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        {
                            transform: [{ translateX: shimmerTranslate }],
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        overflow: 'hidden',
    },
    cardTitle: {
        width: '80%',
        height: 16,
        borderRadius: 4,
        backgroundColor: '#e8eaed',
        alignSelf: 'center',
        overflow: 'hidden',
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