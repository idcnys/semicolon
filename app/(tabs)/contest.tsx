import { AlertCircle, Trophy } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
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

    const getCount = (p: string) => {
        if (!contestCount) return 0;
        if (p === 'All') return contestCount.total || 0;
        if (p === 'Codeforces') return contestCount.codeforces || 0;
        if (p === 'AtCoder') return contestCount.atcoder || 0;
        if (p === 'CodeChef') return contestCount.codechef || 0;
        return 0;
    };

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
                    {usingFallback && (
                        <View style={styles.fallbackBadge}>
                            <AlertCircle size={14} color="#92400E" />
                            <Text style={styles.fallbackBadgeText}>Demo</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.filterRow}>
                {[
                    { key: 'All', label: 'All' },
                    { key: 'Codeforces', label: 'CF' },
                    { key: 'AtCoder', label: 'AT' },
                    { key: 'CodeChef', label: 'CC' },
                ].map((p) => (
                    <TouchableOpacity
                        key={p.key}
                        onPress={() => setPlatformFilter(p.key as any)}
                        style={[
                            styles.filterButton,
                            platformFilter === p.key && styles.filterButtonActive
                        ]}
                    >
                        <View style={styles.filterInner}>
                            <Text style={[styles.filterText, platformFilter === p.key && styles.filterTextActive]}>{p.label}</Text>
                            {getCount(p.key) > 0 && (
                                <View style={styles.smallBadge}>
                                    <Text style={styles.smallBadgeText}>{getCount(p.key)}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            
            {error && (
                <View style={styles.errorBanner}>
                    <AlertCircle size={16} color="#991B1B" />
                    <Text style={styles.errorBannerText}>{error}</Text>
                </View>
            )}

            {/* platform counts moved into filter buttons */}
            
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
    /* platform counts are shown in filter badges now */
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
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        gap: 6,
    },
    filterButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterButtonActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
    },
    filterText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#1D4ED8',
    },
    filterInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    smallBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallBadgeText: {
        color: '#1D4ED8',
        fontSize: 11,
        fontWeight: '700',
    },
    groupContainer: {
        marginBottom: 20,
    },
});

export default ContestSchedule;