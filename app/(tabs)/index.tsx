import { AlertCircle, Trophy } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
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
        contestCount,
        onRefresh,
    } = useContests();

    const [platformFilter, setPlatformFilter] = useState<'All' | 'Codeforces' | 'AtCoder' | 'CodeChef'>('All');

    const filteredContests = useMemo(() => {
        if (platformFilter === 'All') return groupedContests;
        // Filter contests within each group
        return groupedContests
            .map(group => ({
                ...group,
                contests: group.contests.filter(c => c.platform === platformFilter)
            }))
            .filter(group => group.contests.length > 0);
    }, [groupedContests, platformFilter]);

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
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.titleContainer}>
                <View style={styles.titleRow}>
                    <Trophy size={24} color="#2563EB" />
                    <Text style={styles.title}>Upcoming Contests</Text>
                </View>
                <View style={styles.headerRight}>
                    {contestCount && contestCount.total > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>
                                {contestCount.total}
                            </Text>
                        </View>
                    )}
                    {usingFallback && (
                        <View style={styles.fallbackBadge}>
                            <AlertCircle size={14} color="#92400E" />
                            <Text style={styles.fallbackBadgeText}>Demo</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.filterRow}>
                {['All', 'Codeforces', 'AtCoder', 'CodeChef'].map((p) => (
                    <TouchableOpacity
                        key={p}
                        onPress={() => setPlatformFilter(p as any)}
                        style={[
                            styles.filterButton,
                            platformFilter === p && styles.filterButtonActive
                        ]}
                    >
                        <Text style={[styles.filterText, platformFilter === p && styles.filterTextActive]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {error && (
                <View style={styles.errorBanner}>
                    <AlertCircle size={16} color="#991B1B" />
                    <Text style={styles.errorBannerText}>{error}</Text>
                </View>
            )}

            {/* Platform stats */}
            {contestCount && contestCount.total > 0 && (
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={[styles.statDot, { backgroundColor: '#1F8ACB' }]} />
                            <Text style={styles.statText}>Codeforces: {contestCount.codeforces}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statDot, { backgroundColor: '#222222' }]} />
                            <Text style={styles.statText}>AtCoder: {contestCount.atcoder}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statDot, { backgroundColor: '#5B4638' }]} />
                            <Text style={styles.statText}>CodeChef: {contestCount.codechef}</Text>
                        </View>
                    </View>
                </View>
            )}
            
            <FlatList
                data={filteredContests}
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
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    countText: {
        color: '#1D4ED8',
        fontSize: 13,
        fontWeight: '700',
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
    statsContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
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
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterButtonActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
    },
    filterText: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#1D4ED8',
    },
    groupContainer: {
        marginBottom: 20,
    },
});

export default ContestSchedule;