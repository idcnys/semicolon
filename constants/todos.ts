export const STORAGE_KEY = 'todos_data';

export const PRIORITY_COLORS = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
    default: '#6B7280',
} as const;

export const FILTERS: Array<{ value: 'all' | 'today' | 'upcoming' | 'completed'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
];

export const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const;

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];