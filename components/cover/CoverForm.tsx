import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
    Bookmark,
    Calendar,
    Clock,
    Eye,
    FileText,
    Layers,
    User,
    UserCircle
} from 'lucide-react-native';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SECTIONS, TYPE_OPTIONS } from '../../constants/cover';
import { formatDate } from '../../scripts/coverHelpers';
import { CoverState } from '../../types/cover';

interface CoverFormProps {
    state: CoverState;
    showExpDatePicker: boolean;
    showSubDatePicker: boolean;
    onFieldChange: <K extends keyof CoverState>(field: K, value: CoverState[K]) => void;
    onExpDatePickerChange: (show: boolean) => void;
    onSubDatePickerChange: (show: boolean) => void;
    onPreview: () => void;
    onGeneratePDF: () => void;
    isGenerating: boolean;
}

export const CoverForm: React.FC<CoverFormProps> = ({
    state,
    showExpDatePicker,
    showSubDatePicker,
    onFieldChange,
    onExpDatePickerChange,
    onSubDatePickerChange,
    onPreview,
    onGeneratePDF,
    isGenerating,
}) => {
    const onExpDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
        onExpDatePickerChange(Platform.OS === 'ios');
        if (selectedDate) {
            onFieldChange('expDate', selectedDate);
        }
    };

    const onSubDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
        onSubDatePickerChange(Platform.OS === 'ios');
        if (selectedDate) {
            onFieldChange('subDate', selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            {/* Course Information */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Bookmark size={16} color="#37352f" />
                    <Text style={styles.sectionHeaderText}>Course Information</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                            <Text style={styles.label}>Course No.</Text>
                            <TextInput
                                style={styles.input}
                                value={state.courseNo}
                                onChangeText={(value: string) => onFieldChange('courseNo', value)}
                                placeholder="e.g. CSE 101"
                                placeholderTextColor="#9b9a97"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldRow}>
                        <View style={styles.fieldFull}>
                            <Text style={styles.label}>Course Title</Text>
                            <TextInput
                                style={styles.input}
                                value={state.courseTitle}
                                onChangeText={(value: string) => onFieldChange('courseTitle', value)}
                                placeholder="Introduction to Programming"
                                placeholderTextColor="#9b9a97"
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Assignment Details */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Layers size={16} color="#37352f" />
                    <Text style={styles.sectionHeaderText}>Assignment Details</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                            <Text style={styles.label}>Type</Text>
                            <View style={styles.pickerContainer}>
                                {TYPE_OPTIONS.map(({ value, label }) => (
                                    <TouchableOpacity
                                        key={value}
                                        style={[
                                            styles.pickerOption,
                                            state.typeSelect === value && styles.pickerOptionSelected,
                                        ]}
                                        onPress={() => onFieldChange('typeSelect', value)}
                                    >
                                        <Text style={[
                                            styles.pickerOptionText,
                                            state.typeSelect === value && styles.pickerOptionTextSelected,
                                        ]}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.fieldHalf}>
                            <Text style={styles.label}>Type No.</Text>
                            <TextInput
                                style={styles.input}
                                value={state.typeNo}
                                onChangeText={(value: string) => onFieldChange('typeNo', value)}
                                placeholder="e.g. 01"
                                placeholderTextColor="#9b9a97"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldRow}>
                        <View style={styles.fieldFull}>
                            <Text style={styles.label}>Type Title</Text>
                            <TextInput
                                style={styles.input}
                                value={state.typeTitle}
                                onChangeText={(value: string) => onFieldChange('typeTitle', value)}
                                placeholder="Arrays and Loops"
                                placeholderTextColor="#9b9a97"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldRow}>
                        <View style={styles.fieldFull}>
                            <Text style={styles.label}>Section</Text>
                            <View style={styles.pickerContainer}>
                                {SECTIONS.map((section) => (
                                    <TouchableOpacity
                                        key={section}
                                        style={[
                                            styles.pickerOption,
                                            state.section === section && styles.pickerOptionSelected,
                                        ]}
                                        onPress={() => onFieldChange('section', section)}
                                    >
                                        <Text style={[
                                            styles.pickerOptionText,
                                            state.section === section && styles.pickerOptionTextSelected,
                                        ]}>
                                            {section}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Teacher Information */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <User size={16} color="#37352f" />
                    <Text style={styles.sectionHeaderText}>Teacher Information</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={state.teacherName}
                                onChangeText={(value: string) => onFieldChange('teacherName', value)}
                                placeholder="Dr. Sarah Ahmed"
                                placeholderTextColor="#9b9a97"
                            />
                        </View>
                        <View style={styles.fieldHalf}>
                            <Text style={styles.label}>Designation</Text>
                            <TextInput
                                style={styles.input}
                                value={state.teacherDesignation}
                                onChangeText={(value: string) => onFieldChange('teacherDesignation', value)}
                                placeholder="Professor"
                                placeholderTextColor="#9b9a97"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldRow}>
                        <View style={styles.fieldFull}>
                            <Text style={styles.label}>Department</Text>
                            <TextInput
                                style={styles.input}
                                value={state.teacherDept}
                                onChangeText={(value: string) => onFieldChange('teacherDept', value)}
                                placeholder="Computer Science & Engineering"
                                placeholderTextColor="#9b9a97"
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Dates */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Clock size={16} color="#37352f" />
                    <Text style={styles.sectionHeaderText}>Dates</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                        {(state.typeSelect === 'lab-report' || state.typeSelect === 'project') && (
                            <View style={styles.fieldHalf}>
                                <Text style={styles.label}>Experiment Date</Text>
                                <TouchableOpacity
                                    style={styles.dateInput}
                                    onPress={() => onExpDatePickerChange(true)}
                                >
                                    <Text style={styles.dateText}>{formatDate(state.expDate)}</Text>
                                    <Calendar size={18} color="#9b9a97" />
                                </TouchableOpacity>
                                {showExpDatePicker && (
                                    <DateTimePicker
                                        value={state.expDate}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onExpDateChange}
                                    />
                                )}
                            </View>
                        )}
                        <View style={[
                            (state.typeSelect === 'lab-report' || state.typeSelect === 'project') 
                                ? styles.fieldHalf 
                                : styles.fieldFull
                        ]}>
                            <Text style={styles.label}>Submission Date</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => onSubDatePickerChange(true)}
                            >
                                <Text style={styles.dateText}>{formatDate(state.subDate)}</Text>
                                <Calendar size={18} color="#9b9a97" />
                            </TouchableOpacity>
                            {showSubDatePicker && (
                                <DateTimePicker
                                    value={state.subDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onSubDateChange}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {/* Student Information */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <UserCircle size={16} color="#37352f" />
                    <Text style={styles.sectionHeaderText}>Student Information</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#9b9a97"
                                value={state.studentName}
                                onChangeText={(value: string) => onFieldChange('studentName', value)}
                            />
                        </View>
                        <View style={styles.fieldHalf}>
                            <Text style={styles.label}>Roll Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="2403001"
                                placeholderTextColor="#9b9a97"
                                value={state.studentRoll}
                                onChangeText={(value: string) => onFieldChange('studentRoll', value)}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={onPreview}
                >
                    <Eye size={16} color="#37352f" />
                    <Text style={styles.buttonSecondaryText}>Preview</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={onGeneratePDF}
                    disabled={isGenerating}
                >
                    <FileText size={16} color="#ffffff" />
                    <Text style={styles.buttonPrimaryText}>
                        {isGenerating ? 'Generating...' : 'Generate PDF'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e8e7e4',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0efec',
    },
    sectionHeaderText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#37352f',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        marginLeft: 8,
    },
    fieldGroup: {
        marginBottom: 4,
    },
    fieldRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    fieldHalf: {
        flex: 1,
        marginRight: 6,
    },
    fieldFull: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b6b6b',
        letterSpacing: 0.2,
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e8e7e4',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#37352f',
        minHeight: 40,
    },
    pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pickerOption: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#f7f6f3',
        borderWidth: 1,
        borderColor: 'transparent',
        minHeight: 32,
        justifyContent: 'center',
        marginRight: 6,
        marginBottom: 4,
    },
    pickerOptionSelected: {
        backgroundColor: '#37352f',
        borderColor: '#37352f',
    },
    pickerOptionText: {
        color: '#37352f',
        fontSize: 13,
        fontWeight: '450',
    },
    pickerOptionTextSelected: {
        color: '#ffffff',
    },
    dateInput: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e8e7e4',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 40,
    },
    dateText: {
        fontSize: 14,
        color: '#37352f',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 8,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0efec',
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        marginHorizontal: 4,
    },
    buttonPrimary: {
        backgroundColor: '#37352f',
    },
    buttonSecondary: {
        backgroundColor: '#f7f6f3',
        borderWidth: 1,
        borderColor: '#e8e7e4',
    },
    buttonPrimaryText: {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: 14,
    },
    buttonSecondaryText: {
        color: '#37352f',
        fontWeight: '500',
        fontSize: 14,
    },
});