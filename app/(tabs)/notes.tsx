import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { TodoEmptyState } from '../../components/notes/TodoEmptyState';
import { TodoFilters } from '../../components/notes/TodoFilters';
import { TodoForm } from '../../components/notes/TodoForm';
import { TodoHeader } from '../../components/notes/TodoHeader';
import { TodoItem } from '../../components/notes/TodoItem';
import { TodoLoadingSkeleton } from '../../components/notes/TodoLoadingSkeleton';
import { useTodos } from '../../hooks/useTodos';

export default function NotesScreen() {
    const {
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
    } = useTodos();

    // Form states
    const [todoText, setTodoText] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [dueTime, setDueTime] = useState<Date | null>(null);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [isTodoModalVisible, setIsTodoModalVisible] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

    // Date picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    // Load todos on mount
    useEffect(() => {
        loadTodosOnMount();
    }, []);

    // Run animations after loading
    useEffect(() => {
        if (!isLoading) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isLoading]);

    const resetTodoForm = () => {
        setTodoText('');
        setDueDate(null);
        setDueTime(null);
        setPriority('medium');
        setEditingTodoId(null);
    };

    const openTodoEditor = (todo?: any) => {
        if (todo) {
            setTodoText(todo.text);
            setDueDate(todo.dueDate);
            setDueTime(todo.dueTime);
            setPriority(todo.priority);
            setEditingTodoId(todo.id);
        } else {
            resetTodoForm();
        }
        setIsTodoModalVisible(true);
    };

    const handleSaveTodo = () => {
        if (!todoText.trim()) return;

        if (editingTodoId) {
            updateTodo(editingTodoId, {
                text: todoText.trim(),
                dueDate,
                dueTime,
                priority,
            });
        } else {
            addTodo({
                text: todoText.trim(),
                dueDate,
                dueTime,
                priority,
            });
        }
        resetTodoForm();
        setIsTodoModalVisible(false);
        setEditingTodoId(null);
    };

    const handleCloseModal = () => {
        setIsTodoModalVisible(false);
        resetTodoForm();
    };

    const handleDatePickerChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        setShowTimePicker(false);
        if (selectedDate) {
            if (pickerMode === 'date') {
                setDueDate(selectedDate);
                setTimeout(() => {
                    setShowTimePicker(true);
                    setPickerMode('time');
                }, 300);
            } else {
                setDueTime(selectedDate);
            }
        }
    };

    const filteredTodos = getFilteredTodos();

    if (isLoading) {
        return <TodoLoadingSkeleton />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ExpoStatusBar style="dark" />
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            <View style={styles.container}>
                <TodoHeader
                    todos={todos}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAddPress={() => openTodoEditor()}
                />

                <TodoFilters
                    currentFilter={filterType}
                    onFilterChange={setFilterType}
                />

                {isSaving && (
                    <View style={styles.savingIndicator}>
                        <ActivityIndicator size="small" color="#6B7280" />
                        <Text style={styles.savingText}>Saving...</Text>
                    </View>
                )}

                <FlatList
                    data={filteredTodos}
                    renderItem={({ item }) => (
                        <TodoItem
                            item={item}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            fadeAnim={fadeAnim}
                            slideAnim={slideAnim}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.todosList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<TodoEmptyState filterType={filterType} />}
                />
            </View>

            <TodoForm
                visible={isTodoModalVisible}
                editingTodoId={editingTodoId}
                todoText={todoText}
                dueDate={dueDate}
                dueTime={dueTime}
                priority={priority}
                showDatePicker={showDatePicker}
                showTimePicker={showTimePicker}
                pickerMode={pickerMode}
                onTextChange={setTodoText}
                onDueDateChange={setDueDate}
                onDueTimeChange={setDueTime}
                onPriorityChange={setPriority}
                onClose={handleCloseModal}
                onSave={handleSaveTodo}
                onDatePickerChange={handleDatePickerChange}
                onShowDatePicker={setShowDatePicker}
                onShowTimePicker={setShowTimePicker}
                onPickerModeChange={setPickerMode}
                onClearDateTime={() => {
                    setDueDate(null);
                    setDueTime(null);
                }}
                isSaving={isSaving}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    savingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    savingText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    todosList: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
    },
});