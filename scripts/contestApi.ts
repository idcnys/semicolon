import { CodeforcesContest, Contest } from '../types/contests';

// CLIST API configuration
const CLIST_USERNAME = 'bitto';
const CLIST_API_KEY = '295bbfd28623f0f84380f253de99ac08fbf5cfd6';

interface ClistContest {
  id: number;
  resource: string;
  event: string;
  start: string;
  end: string;
  duration: number;
  href: string;
}

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

export async function fetchAtCoderContests(): Promise<Contest[]> {
    try {
        console.log('📡 Fetching AtCoder contests from CLIST...');
        
        const endpoint = 
            `https://clist.by/api/v4/contest/?` +
            `username=${CLIST_USERNAME}` +
            `&api_key=${CLIST_API_KEY}` +
            `&upcoming=true` +
            `&resource=atcoder.jp` +
            `&order_by=start` +
            `&limit=50`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const contests = data.objects || [];
        
        console.log(`✅ Found ${contests.length} upcoming AtCoder contests`);
        
        if (contests.length === 0) {
            return [];
        }
        
        return contests.map((contest: ClistContest) => {
            const startTime = new Date(contest.start);
            const endTime = new Date(contest.end);
            const now = new Date();
            const diffMs = startTime.getTime() - now.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            let startsIn: string;
            if (diffDays > 0) {
                startsIn = `${diffDays}d ${diffHours % 24}h`;
            } else if (diffHours > 0) {
                startsIn = `${diffHours}h ${Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))}m`;
            } else if (diffMs > 0) {
                const diffMins = Math.floor(diffMs / (1000 * 60));
                startsIn = `${diffMins}m`;
            } else {
                startsIn = 'Started';
            }
            
            // Calculate duration from start and end
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
            const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
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
                id: `at-${contest.id}`,
                platform: 'AtCoder',
                event: contest.event,
                startDate: dateStr,
                time: timeStr,
                startsIn,
                duration,
                timestamp: startTime.getTime(),
                url: contest.href,
            };
        });
    } catch (error) {
        console.error('❌ AtCoder API Error:', error);
        return [];
    }
}

export async function fetchCodeChefContests(): Promise<Contest[]> {
    try {
        console.log('📡 Fetching CodeChef contests from CLIST...');
        
        const endpoint = 
            `https://clist.by/api/v4/contest/?` +
            `username=${CLIST_USERNAME}` +
            `&api_key=${CLIST_API_KEY}` +
            `&upcoming=true` +
            `&resource=codechef.com` +
            `&order_by=start` +
            `&limit=50`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const contests = data.objects || [];
        
        console.log(`✅ Found ${contests.length} upcoming CodeChef contests`);
        
        if (contests.length === 0) {
            return [];
        }
        
        return contests.map((contest: ClistContest) => {
            const startTime = new Date(contest.start);
            const endTime = new Date(contest.end);
            const now = new Date();
            const diffMs = startTime.getTime() - now.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            let startsIn: string;
            if (diffDays > 0) {
                startsIn = `${diffDays}d ${diffHours % 24}h`;
            } else if (diffHours > 0) {
                startsIn = `${diffHours}h ${Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))}m`;
            } else if (diffMs > 0) {
                const diffMins = Math.floor(diffMs / (1000 * 60));
                startsIn = `${diffMins}m`;
            } else {
                startsIn = 'Started';
            }
            
            // Calculate duration from start and end
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
            const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
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
                id: `cc-${contest.id}`,
                platform: 'CodeChef',
                event: contest.event,
                startDate: dateStr,
                time: timeStr,
                startsIn,
                duration,
                timestamp: startTime.getTime(),
                url: contest.href,
            };
        });
    } catch (error) {
        console.error('❌ CodeChef API Error:', error);
        return [];
    }
}

// Combined function to fetch all contests using CLIST for AtCoder and CodeChef
export async function fetchAllContests(): Promise<Contest[]> {
    try {
        console.log('📡 Fetching all contests...');
        
        const [codeforces, atcoder, codechef] = await Promise.all([
            fetchCodeforcesContests(),
            fetchAtCoderContests(),
            fetchCodeChefContests(),
        ]);
        
        const allContests = [...codeforces, ...atcoder, ...codechef]
            .sort((a, b) => a.timestamp - b.timestamp);
        
        console.log(`✅ Total: ${allContests.length} upcoming contests found`);
        return allContests;
    } catch (error) {
        console.error('❌ Error fetching contests:', error);
        throw error;
    }
}