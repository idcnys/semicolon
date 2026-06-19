import { Calendar, CheckCircle, Circle, Clock, Trash2 } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { formatDateTime, getPriorityColor } from '../../scripts/todoHelpers';
import { Todo } from '../../types/todos';

interface TodoItemProps {
    item: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

export const TodoItem: React.FC<TodoItemProps> = ({
    item,
    onToggle,
    onDelete,
    fadeAnim,
    slideAnim,
}) => {
    const priorityColor = getPriorityColor(item.priority);
    const isCompleted = item.completed;

    return (
        <Animated.View
            style={[
                styles.todoItemWrapper,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={[styles.todoItem, isCompleted && styles.todoItemCompleted]}>
                <TouchableOpacity
                    style={styles.todoCheckbox}
                    onPress={() => onToggle(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    {isCompleted ? (
                        <View style={styles.checkboxChecked}>
                            <CheckCircle size={24} color="#10B981" />
                        </View>
                    ) : (
                        <View style={styles.checkboxUnchecked}>
                            <Circle size={24} color="#D1D5DB" />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.todoContent}>
                    <Text
                        style={[
                            styles.todoText,
                            isCompleted && styles.todoTextCompleted,
                        ]}
                    >
                        {item.text}
                    </Text>

                    {(item.dueDate || item.dueTime) && (
                        <View style={styles.todoMeta}>
                            <View style={styles.todoMetaItem}>
                                {item.dueDate && <Calendar size={12} color="#9CA3AF" />}
                                {item.dueTime && <Clock size={12} color="#9CA3AF" />}
                                <Text style={styles.todoMetaText}>
                                    {formatDateTime(item.dueDate, item.dueTime)}
                                </Text>
                            </View>
                            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.todoDeleteButton}
                    onPress={() => onDelete(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Trash2 size={18} color="#FCA5A5" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    todoItemWrapper: {
        marginBottom: 8,
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    todoItemCompleted: {
        backgroundColor: '#FAFAFA',
        opacity: 0.7,
    },
    todoCheckbox: {
        padding: 2,
        marginRight: 12,
    },
    checkboxChecked: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxUnchecked: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    todoContent: {
        flex: 1,
    },
    todoText: {
        fontSize: 15,
        color: '#1F2937',
        marginBottom: 4,
    },
    todoTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
    todoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    todoMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
    },
    todoMetaText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    todoDeleteButton: {
        padding: 4,
        marginLeft: 4,
    },
});