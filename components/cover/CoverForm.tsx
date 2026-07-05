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

    const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                {icon}
                <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const renderField = (label: string, children: React.ReactNode, half?: boolean) => (
        <View style={[styles.fieldContainer, half && styles.fieldHalf]}>
            <Text style={styles.label}>{label}</Text>
            {children}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Course Information */}
            {renderSection('Course Information', <Bookmark size={15} color="#555" />,
                <>
                    <View style={styles.row}>
                        {renderField('Course No.', 
                            <TextInput
                                style={styles.input}
                                value={state.courseNo}
                                onChangeText={(value: string) => onFieldChange('courseNo', value)}
                                placeholder="e.g. CSE 101"
                                placeholderTextColor="#aaa"
                            />, true
                        )}
                    </View>
                    <View style={styles.row}>
                        {renderField('Course Title',
                            <TextInput
                                style={styles.input}
                                value={state.courseTitle}
                                onChangeText={(value: string) => onFieldChange('courseTitle', value)}
                                placeholder="Introduction to Programming"
                                placeholderTextColor="#aaa"
                            />, false
                        )}
                    </View>
                </>
            )}

            {/* Assignment Details */}
            {renderSection('Assignment Details', <Layers size={15} color="#555" />,
                <>
                    <View style={styles.row}>
                        {renderField('Type', 
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
                            </View>, true
                        )}
                        {renderField('Type No.',
                            <TextInput
                                style={styles.input}
                                value={state.typeNo}
                                onChangeText={(value: string) => onFieldChange('typeNo', value)}
                                placeholder="e.g. 01"
                                placeholderTextColor="#aaa"
                            />, true
                        )}
                    </View>
                    <View style={styles.row}>
                        {renderField('Type Title',
                            <TextInput
                                style={styles.input}
                                value={state.typeTitle}
                                onChangeText={(value: string) => onFieldChange('typeTitle', value)}
                                placeholder="Arrays and Loops"
                                placeholderTextColor="#aaa"
                            />, false
                        )}
                    </View>
                    <View style={styles.row}>
                        {renderField('Section',
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
                            </View>, false
                        )}
                    </View>
                </>
            )}

            {/* Teacher Information */}
            {renderSection('Teacher Information', <User size={15} color="#555" />,
                <>
                    <View style={styles.row}>
                        {renderField('Name',
                            <TextInput
                                style={styles.input}
                                value={state.teacherName}
                                onChangeText={(value: string) => onFieldChange('teacherName', value)}
                                placeholder="Dr. Sarah Ahmed"
                                placeholderTextColor="#aaa"
                            />, true
                        )}
                        {renderField('Designation',
                            <TextInput
                                style={styles.input}
                                value={state.teacherDesignation}
                                onChangeText={(value: string) => onFieldChange('teacherDesignation', value)}
                                placeholder="Professor"
                                placeholderTextColor="#aaa"
                            />, true
                        )}
                    </View>
                    <View style={styles.row}>
                        {renderField('Department',
                            <TextInput
                                style={styles.input}
                                value={state.teacherDept}
                                onChangeText={(value: string) => onFieldChange('teacherDept', value)}
                                placeholder="Computer Science & Engineering"
                                placeholderTextColor="#aaa"
                            />, false
                        )}
                    </View>
                </>
            )}

            {/* Dates */}
            {renderSection('Dates', <Clock size={15} color="#555" />,
                <View style={styles.row}>
                    {(state.typeSelect === 'lab-report' || state.typeSelect === 'project') && (
                        renderField('Experiment Date',
                            <>
                                <TouchableOpacity
                                    style={styles.dateInput}
                                    onPress={() => onExpDatePickerChange(true)}
                                >
                                    <Text style={styles.dateText}>{formatDate(state.expDate)}</Text>
                                    <Calendar size={16} color="#999" />
                                </TouchableOpacity>
                                {showExpDatePicker && (
                                    <DateTimePicker
                                        value={state.expDate}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onExpDateChange}
                                    />
                                )}
                            </>, true
                        )
                    )}
                    {renderField('Submission Date',
                        <>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => onSubDatePickerChange(true)}
                            >
                                <Text style={styles.dateText}>{formatDate(state.subDate)}</Text>
                                <Calendar size={16} color="#999" />
                            </TouchableOpacity>
                            {showSubDatePicker && (
                                <DateTimePicker
                                    value={state.subDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onSubDateChange}
                                />
                            )}
                        </>, 
                        (state.typeSelect === 'lab-report' || state.typeSelect === 'project') ? true : false
                    )}
                </View>
            )}

            {/* Student Information */}
            {renderSection('Student Information', <UserCircle size={15} color="#555" />,
                <View style={styles.row}>
                    {renderField('Full Name',
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor="#aaa"
                            value={state.studentName}
                            onChangeText={(value: string) => onFieldChange('studentName', value)}
                        />, true
                    )}
                    {renderField('Roll Number',
                        <TextInput
                            style={styles.input}
                            placeholder="2403001"
                            placeholderTextColor="#aaa"
                            value={state.studentRoll}
                            onChangeText={(value: string) => onFieldChange('studentRoll', value)}
                        />, true
                    )}
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={onPreview}
                >
                    <Eye size={16} color="#555" />
                    <Text style={styles.buttonSecondaryText}>Preview</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={onGeneratePDF}
                    disabled={isGenerating}
                >
                    <FileText size={16} color="#fff" />
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
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e8e5e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0eeea',
    },
    sectionHeaderText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#444',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        marginLeft: 7,
    },
    sectionContent: {
        gap: 6,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    fieldContainer: {
        flex: 1,
        gap: 4,
    },
    fieldHalf: {
        flex: 0.5,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: '#777',
        letterSpacing: 0.2,
    },
    input: {
        backgroundColor: '#fafaf8',
        borderWidth: 1,
        borderColor: '#e8e5e0',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 13,
        color: '#333',
        minHeight: 36,
    },
    pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    pickerOption: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f5f4f0',
        borderWidth: 1,
        borderColor: 'transparent',
        minHeight: 28,
        justifyContent: 'center',
    },
    pickerOptionSelected: {
        backgroundColor: '#333',
        borderColor: '#333',
    },
    pickerOptionText: {
        color: '#555',
        fontSize: 12,
        fontWeight: '500',
    },
    pickerOptionTextSelected: {
        color: '#fff',
    },
    dateInput: {
        backgroundColor: '#fafaf8',
        borderWidth: 1,
        borderColor: '#e8e5e0',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 36,
    },
    dateText: {
        fontSize: 13,
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 4,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0eeea',
        gap: 8,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 38,
        gap: 6,
    },
    buttonPrimary: {
        backgroundColor: '#333',
    },
    buttonSecondary: {
        backgroundColor: '#f5f4f0',
        borderWidth: 1,
        borderColor: '#e8e5e0',
    },
    buttonPrimaryText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 13,
    },
    buttonSecondaryText: {
        color: '#555',
        fontWeight: '500',
        fontSize: 13,
    },
});