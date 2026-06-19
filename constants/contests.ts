import { Contest } from '../types/contests';

export const FALLBACK_CONTESTS: Contest[] = [
    {
        id: 'fallback-1',
        platform: 'Codeforces',
        event: 'Codeforces Round 999 (Div. 2)',
        startDate: 'Jun 20',
        time: '10:35 AM',
        startsIn: '23h 45m',
        duration: '2h',
        timestamp: new Date('2026-06-20T10:35:00').getTime(),
        url: 'https://codeforces.com/',
    },
    {
        id: 'fallback-2',
        platform: 'Codeforces',
        event: 'Codeforces Round 1000 (Div. 1 + Div. 2)',
        startDate: 'Jun 21',
        time: '02:00 PM',
        startsIn: '2d 4h',
        duration: '2h 30m',
        timestamp: new Date('2026-06-21T14:00:00').getTime(),
        url: 'https://codeforces.com/',
    },
    {
        id: 'fallback-3',
        platform: 'Codeforces',
        event: 'Educational Codeforces Round 170',
        startDate: 'Jun 23',
        time: '08:00 PM',
        startsIn: '4d 10h',
        duration: '2h',
        timestamp: new Date('2026-06-23T20:00:00').getTime(),
        url: 'https://codeforces.com/',
    },
];