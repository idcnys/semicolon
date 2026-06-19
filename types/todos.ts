export type Todo = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    dueDate: Date | null;
    dueTime: Date | null;
    priority: 'low' | 'medium' | 'high';
};

export type FilterType = 'all' | 'today' | 'upcoming' | 'completed';