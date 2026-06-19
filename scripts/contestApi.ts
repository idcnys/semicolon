import { CodeforcesContest, Contest } from '../types/contests';

export async function fetchCodeforcesContests(): Promise<Contest[]> {
    try {
        console.log('📡 Fetching Codeforces contests...');
        
        const response = await fetch('https://codeforces.com/api/contest.list');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'OK') {
            throw new Error('Codeforces API returned error status');
        }
        
        const upcoming = data.result
            .filter((contest: CodeforcesContest) => contest.phase === 'BEFORE')
            .sort((a: CodeforcesContest, b: CodeforcesContest) => 
                a.startTimeSeconds - b.startTimeSeconds
            );
        
        console.log(`✅ Found ${upcoming.length} upcoming Codeforces contests`);
        
        if (upcoming.length === 0) {
            return [];
        }
        
        return upcoming.map((contest: CodeforcesContest) => {
            const startTime = new Date(contest.startTimeSeconds * 1000);
            const now = new Date();
            const diffMs = startTime.getTime() - now.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            let startsIn: string;
            if (diffDays > 0) {
                startsIn = `${diffDays}d ${diffHours % 24}h`;
            } else if (diffHours > 0) {
                startsIn = `${diffHours}h ${Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))}m`;
            } else {
                const diffMins = Math.floor(diffMs / (1000 * 60));
                startsIn = `${diffMins}m`;
            }
            
            const durationHours = Math.floor(contest.durationSeconds / 3600);
            const durationMins = Math.floor((contest.durationSeconds % 3600) / 60);
            let duration = '';
            if (durationHours > 0) {
                duration += `${durationHours}h`;
            }
            if (durationMins > 0) {
                if (duration) duration += ' ';
                duration += `${durationMins}m`;
            }
            if (!duration) duration = 'N/A';
            
            const dateStr = startTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            const timeStr = startTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
            
            return {
                id: `cf-${contest.id}`,
                platform: 'Codeforces',
                event: contest.name,
                startDate: dateStr,
                time: timeStr,
                startsIn,
                duration,
                timestamp: startTime.getTime(),
                url: `https://codeforces.com/contest/${contest.id}`,
            };
        });
    } catch (error) {
        console.error('❌ Codeforces API Error:', error);
        throw error;
    }
}