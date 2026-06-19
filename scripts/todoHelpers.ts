import { DAYS, MONTHS, PRIORITY_COLORS } from '../constants/todos';
import { FilterType, Todo } from '../types/todos';

export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case 'high': return PRIORITY_COLORS.high;
        case 'medium': return PRIORITY_COLORS.medium;
        case 'low': return PRIORITY_COLORS.low;
        default: return PRIORITY_COLORS.default;
    }
};

export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

export const formatDateTime = (date: Date | null, time: Date | null): string | null => {
    if (!date && !time) return null;
    
    const dateObj = date || new Date();
    const timeObj = time || new Date();
    
    // Format time: 8:30 PM
    let hours = timeObj.getHours();
    const minutes = timeObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    // Format date: 19 July 2026 (Monday)
    const dayName = DAYS[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const dateStr = `${day} ${month} ${year} (${dayName})`;
    
    return `${timeStr}, ${dateStr}`;
};

export const getEmptyStateMessage = (filterType: FilterType): string => {
    const messages = {
        all: 'No tasks yet',
        today: 'No tasks for today',
        upcoming: 'No upcoming tasks',
        completed: 'No completed tasks',
    };
    return messages[filterType];
};

export const getEmptyStateSubtext = (filterType: FilterType): string => {
    if (filterType === 'all') {
        return 'Tap the + button to create your first task';
    }
    return 'Try a different filter';
};

export const getStats = (todos: Todo[]) => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
};

export const filterTodos = (todos: Todo[], searchQuery: string, filterType: FilterType): Todo[] => {
    let filtered = todos;

    // Search filter
    if (searchQuery.trim()) {
        filtered = filtered.filter(todo =>
            todo.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Type filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterType) {
        case 'today':
            filtered = filtered.filter(todo => {
                if (!todo.dueDate) return false;
                const dueDate = new Date(todo.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate.getTime() === today.getTime() && !todo.completed;
            });
            break;
        case 'upcoming':
            filtered = filtered.filter(todo => {
                if (todo.completed) return false;
                if (!todo.dueDate) return true;
                const dueDate = new Date(todo.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate.getTime() >= today.getTime();
            });
            break;
        case 'completed':
            filtered = filtered.filter(todo => todo.completed);
            break;
        default:
            break;
    }

    // Sort: uncompleted first, then by date
    return filtered.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });
};