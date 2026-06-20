import { useCallback, useEffect, useState } from 'react';
import { FALLBACK_CONTESTS } from '../constants/contests';
import { fetchAllContests } from '../scripts/contestApi';
import { groupContestsByDate } from '../scripts/contestHelpers';
import { GroupedContests } from '../types/contests';

export const useContests = () => {
    const [groupedContests, setGroupedContests] = useState<GroupedContests[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);
    const [contestCount, setContestCount] = useState({ 
        codeforces: 0, 
        atcoder: 0, 
        codechef: 0,
        total: 0 
    });

    const loadContests = useCallback(async () => {
        try {
            setError(null);
            setUsingFallback(false);
            
            console.log('🚀 Loading all contests from all platforms...');
            
            const contests = await fetchAllContests();
            
            if (contests && contests.length > 0) {
                const grouped = groupContestsByDate(contests);
                setGroupedContests(grouped);
                
                // Count contests by platform
                const cfCount = contests.filter(c => c.platform === 'Codeforces').length;
                const atCount = contests.filter(c => c.platform === 'AtCoder').length;
                const ccCount = contests.filter(c => c.platform === 'CodeChef').length;
                
                setContestCount({
                    codeforces: cfCount,
                    atcoder: atCount,
                    codechef: ccCount,
                    total: contests.length
                });
                
                console.log(`✅ Loaded ${contests.length} contests total (CF: ${cfCount}, AT: ${atCount}, CC: ${ccCount})`);
            } else {
                console.log('⚠️ No contests found, using fallback data');
                const grouped = groupContestsByDate(FALLBACK_CONTESTS);
                setGroupedContests(grouped);
                setUsingFallback(true);
                setError('No upcoming contests found. Showing sample data.');
                
                setContestCount({
                    codeforces: FALLBACK_CONTESTS.filter(c => c.platform === 'Codeforces').length,
                    atcoder: FALLBACK_CONTESTS.filter(c => c.platform === 'AtCoder').length,
                    codechef: FALLBACK_CONTESTS.filter(c => c.platform === 'CodeChef').length,
                    total: FALLBACK_CONTESTS.length
                });
            }
        } catch (err) {
            console.error('❌ Failed to load contests:', err);
            
            const grouped = groupContestsByDate(FALLBACK_CONTESTS);
            setGroupedContests(grouped);
            setUsingFallback(true);
            setError('Unable to fetch live data. Showing sample contests.');
            
            setContestCount({
                codeforces: FALLBACK_CONTESTS.filter(c => c.platform === 'Codeforces').length,
                atcoder: FALLBACK_CONTESTS.filter(c => c.platform === 'AtCoder').length,
                codechef: FALLBACK_CONTESTS.filter(c => c.platform === 'CodeChef').length,
                total: FALLBACK_CONTESTS.length
            });
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
        contestCount,
        onRefresh,
        loadContests
    };
};