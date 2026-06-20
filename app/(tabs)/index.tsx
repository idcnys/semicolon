import { AlertCircle, Trophy } from 'lucide-react-native';
import React from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContestCard } from '../../components/contests/ContestCard';
import { ContestLoadingSkeleton } from '../../components/contests/ContestLoadingSkeleton';
import { DateHeader } from '../../components/contests/DateHeader';
import { EmptyState } from '../../components/contests/EmptyState';
import { useContests } from '../../hooks/useContests';
import { GroupedContests } from '../../types/contests';

const ContestSchedule: React.FC = () => {
    const {
        groupedContests,
        loading,
        refreshing,
        error,
        usingFallback,
        onRefresh,
    } = useContests();

    const renderItem = ({ item }: { item: GroupedContests }) => (
        <View style={styles.groupContainer}>
            <DateHeader date={item.date} count={item.count} />
            {item.contests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
            ))}
        </View>
    );

    if (loading) {
        return <ContestLoadingSkeleton />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={styles.titleRow}>
                    <Trophy size={24} color="#2563EB" />
                    <Text style={styles.title}>Upcoming Contests</Text>
                </View>
                {usingFallback && (
                    <View style={styles.fallbackBadge}>
                        <AlertCircle size={14} color="#92400E" />
                        <Text style={styles.fallbackBadgeText}>Demo</Text>
                    </View>
                )}
            </View>
            
            {error && (
                <View style={styles.errorBanner}>
                    <AlertCircle size={16} color="#991B1B" />
                    <Text style={styles.errorBannerText}>{error}</Text>
                </View>
            )}
            
            <FlatList
                data={groupedContests}
                renderItem={renderItem}
                keyExtractor={(item) => item.date}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyState onRefresh={onRefresh} />}
            />
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
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginLeft: 8,
    },
    fallbackBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    fallbackBadgeText: {
        color: '#92400E',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#FCA5A5',
        gap: 8,
    },
    errorBannerText: {
        color: '#991B1B',
        fontSize: 14,
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingTop: 12,
    },
    groupContainer: {
        marginBottom: 20,
    },
});

export default ContestSchedule;