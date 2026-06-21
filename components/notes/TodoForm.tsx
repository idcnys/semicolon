import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock, X } from 'lucide-react-native';
import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PRIORITY_OPTIONS } from '../../constants/todos';
import { formatDateTime, getPriorityColor } from '../../scripts/todoHelpers';

interface TodoFormProps {
    visible: boolean;
    editingTodoId: string | null;
    todoText: string;
    dueDate: Date | null;
    dueTime: Date | null;
    priority: 'low' | 'medium' | 'high';
    showDatePicker: boolean;
    showTimePicker: boolean;
    pickerMode: 'date' | 'time';
    onTextChange: (text: string) => void;
    onDueDateChange: (date: Date | null) => void;
    onDueTimeChange: (time: Date | null) => void;
    onPriorityChange: (priority: 'low' | 'medium' | 'high') => void;
    onClose: () => void;
    onSave: () => void;
    onDatePickerChange: (event: any, selectedDate?: Date) => void;
    onShowDatePicker: (show: boolean) => void;
    onShowTimePicker: (show: boolean) => void;
    onPickerModeChange: (mode: 'date' | 'time') => void;
    onClearDateTime: () => void;
    isSaving?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
    visible,
    editingTodoId,
    todoText,
    dueDate,
    dueTime,
    priority,
    showDatePicker,
    showTimePicker,
    pickerMode,
    onTextChange,
    onDueDateChange,
    onDueTimeChange,
    onPriorityChange,
    onClose,
    onSave,
    onDatePickerChange,
    onShowDatePicker,
    onShowTimePicker,
    onPickerModeChange,
    onClearDateTime,
    isSaving = false,
}) => {
    const handleDatePress = () => {
        onPickerModeChange('date');
        onShowDatePicker(true);
    };

    const handleTimePress = () => {
        onPickerModeChange('time');
        onShowTimePicker(true);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalKeyboardView}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {editingTodoId ? 'Edit Task' : 'New Task'}
                                </Text>
                                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <X size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="What do you need to do?"
                                placeholderTextColor="#9CA3AF"
                                value={todoText}
                                onChangeText={onTextChange}
                                maxLength={200}
                                autoFocus
                            />

                            <View style={styles.modalRow}>
                                <TouchableOpacity style={styles.datePickerButton} onPress={handleDatePress}>
                                    <Calendar size={18} color="#6B7280" />
                                    <Text style={styles.datePickerText}>
                                        {dueDate ? dueDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'Set Date'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.datePickerButton} onPress={handleTimePress}>
                                    <Clock size={18} color="#6B7280" />
                                    <Text style={styles.datePickerText}>
                                        {dueTime ? dueTime.toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        }) : 'Set Time'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {(dueDate || dueTime) && (
                                <View style={styles.dateDisplay}>
                                    <Text style={styles.dateDisplayText}>
                                        {formatDateTime(dueDate, dueTime)}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.modalRow}>
                                <Text style={styles.modalLabel}>Priority</Text>
                                <View style={styles.priorityContainer}>
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <TouchableOpacity
                                            key={p}
                                            style={[
                                                styles.priorityButton,
                                                priority === p && styles.priorityButtonActive,
                                                { borderColor: getPriorityColor(p) },
                                            ]}
                                            onPress={() => onPriorityChange(p)}
                                        >
                                            <View style={[styles.priorityDotSmall, { backgroundColor: getPriorityColor(p) }]} />
                                            <Text style={[
                                                styles.priorityButtonText,
                                                priority === p && styles.priorityButtonTextActive,
                                            ]}>
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.modalSaveButton, !todoText.trim() && styles.modalSaveButtonDisabled]}
                                onPress={onSave}
                                disabled={!todoText.trim() || isSaving}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.modalSaveButtonText}>
                                    {editingTodoId ? 'Update Task' : 'Add Task'}
                                </Text>
                            </TouchableOpacity>

                            {(dueDate || dueTime) && (
                                <TouchableOpacity style={styles.clearDateButton} onPress={onClearDateTime}>
                                    <Text style={styles.clearDateText}>Clear date & time</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                </View>

                {(showDatePicker || showTimePicker) && (
                    <DateTimePicker
                        value={pickerMode === 'date' ? (dueDate || new Date()) : (dueTime || new Date())}
                        mode={pickerMode}
                        is24Hour={false}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDatePickerChange}
                        minimumDate={pickerMode === 'date' ? new Date() : undefined}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalKeyboardView: {
        width: '100%',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        letterSpacing: -0.3,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#FAFAFA',
        color: '#1F2937',
    },
    modalRow: {
        marginBottom: 16,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        marginBottom: 8,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#FAFAFA',
        marginBottom: 8,
    },
    datePickerText: {
        fontSize: 14,
        color: '#1F2937',
    },
    dateDisplay: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    dateDisplayText: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    priorityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FAFAFA',
    },
    priorityButtonActive: {
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
    },
    priorityDotSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    priorityButtonText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    priorityButtonTextActive: {
        color: '#1F2937',
    },
    modalSaveButton: {
        backgroundColor: '#1F2937',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    modalSaveButtonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    modalSaveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: -0.2,
    },
    clearDateButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    clearDateText: {
        fontSize: 13,
        color: '#EF4444',
        fontWeight: '500',
    },
});