import { useCallback, useEffect, useState } from 'react';
import { FALLBACK_CONTESTS } from '../constants/contests';
import { fetchCodeforcesContests } from '../scripts/contestApi';
import { groupContestsByDate } from '../scripts/contestHelpers';
import { GroupedContests } from '../types/contests';

export const useContests = () => {
    const [groupedContests, setGroupedContests] = useState<GroupedContests[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);

    const loadContests = useCallback(async () => {
        try {
            setError(null);
            setUsingFallback(false);
            
            console.log('🚀 Loading Codeforces contests...');
            
            const contests = await fetchCodeforcesContests();
            
            if (contests && contests.length > 0) {
                const grouped = groupContestsByDate(contests);
                setGroupedContests(grouped);
                console.log(`✅ Loaded ${contests.length} Codeforces contests`);
            } else {
                console.log('⚠️ No contests found, using fallback data');
                const grouped = groupContestsByDate(FALLBACK_CONTESTS);
                setGroupedContests(grouped);
                setUsingFallback(true);
                setError('No upcoming contests found. Showing sample data.');
            }
        } catch (err) {
            console.error('❌ Failed to load contests:', err);
            
            const grouped = groupContestsByDate(FALLBACK_CONTESTS);
            setGroupedContests(grouped);
            setUsingFallback(true);
            setError('Unable to fetch live data. Showing sample contests.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadContests();
    }, [loadContests]);

    const onRefresh = () => {
        setRefreshing(true);
        setError(null);
        setUsingFallback(false);
        loadContests();
    };

    return {
        groupedContests,
        loading,
        refreshing,
        error,
        usingFallback,
        onRefresh,
        loadContests
    };
};