import { Contest, GroupedContests } from '../types/contests';

export const groupContestsByDate = (contestList: Contest[]): GroupedContests[] => {
    const groups: Record<string, Contest[]> = {};
    contestList.forEach((contest) => {
        const key = contest.startDate;
        if (!groups[key]) groups[key] = [];
        groups[key].push(contest);
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
        const dateA = new Date(a + ', ' + new Date().getFullYear());
        const dateB = new Date(b + ', ' + new Date().getFullYear());
        return dateA.getTime() - dateB.getTime();
    });

    return sortedKeys.map((date) => ({
        date,
        count: groups[date].length,
        contests: groups[date].sort((a, b) => a.timestamp - b.timestamp),
    }));
};