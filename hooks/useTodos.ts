import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { STORAGE_KEY } from '../constants/todos';
import { filterTodos } from '../scripts/todoHelpers';
import { FilterType, Todo } from '../types/todos';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');

    // Save todos when they change
    useEffect(() => {
        if (!isLoading && !isSaving) {
            saveTodos();
        }
    }, [todos]);

    const loadTodos = async () => {
        try {
            setIsLoading(true);
            const stored = await SecureStore.getItemAsync(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const todosWithDates = parsed.map((todo: any) => ({
                    ...todo,
                    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
                    dueTime: todo.dueTime ? new Date(todo.dueTime) : null,
                }));
                setTodos(todosWithDates);
            }
            await new Promise(resolve => setTimeout(resolve, 600));
        } catch (error) {
            console.error('Error loading todos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveTodos = async () => {
        try {
            setIsSaving(true);
            const todosToStore = todos.map(todo => ({
                ...todo,
                dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
                dueTime: todo.dueTime ? todo.dueTime.toISOString() : null,
            }));
            await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(todosToStore));
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Error saving todos:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            text: todoData.text,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: todoData.dueDate || null,
            dueTime: todoData.dueTime || null,
            priority: todoData.priority || 'medium',
        };
        setTodos([newTodo, ...todos]);
        return newTodo;
    };

    const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'completed'>>) => {
        setTodos(todos.map(todo =>
            todo.id === id
                ? { ...todo, ...updates }
                : todo
        ));
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string, onConfirm?: () => void) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setTodos(todos.filter(todo => todo.id !== id));
                        if (onConfirm) onConfirm();
                    },
                },
            ]
        );
    };

    const getFilteredTodos = () => {
        return filterTodos(todos, searchQuery, filterType);
    };

    const loadTodosOnMount = () => {
        loadTodos();
    };

    return {
        todos,
        isLoading,
        isSaving,
        searchQuery,
        filterType,
        setSearchQuery,
        setFilterType,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        getFilteredTodos,
        loadTodosOnMount,
        loadTodos,
        saveTodos,
    };
};