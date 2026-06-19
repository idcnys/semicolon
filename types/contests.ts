export interface CodeforcesContest {
    id: number;
    name: string;
    type: string;
    phase: string;
    frozen: boolean;
    durationSeconds: number;
    startTimeSeconds: number;
    relativeTimeSeconds: number;
}

export interface Contest {
    id: string;
    platform: 'Codeforces' | 'AtCoder' | 'CodeChef';
    event: string;
    startDate: string;
    time: string;
    startsIn: string;
    duration: string;
    timestamp: number;
    url: string;
}

export interface GroupedContests {
    date: string;
    count: number;
    contests: Contest[];
}