import { Inbox } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getEmptyStateMessage, getEmptyStateSubtext } from '../../scripts/todoHelpers';
import { FilterType } from '../../types/todos';

interface TodoEmptyStateProps {
    filterType: FilterType;
}

export const TodoEmptyState: React.FC<TodoEmptyStateProps> = ({ filterType }) => {
    return (
        <View style={styles.emptyState}>
            <Inbox size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>{getEmptyStateMessage(filterType)}</Text>
            <Text style={styles.emptyStateSubtext}>{getEmptyStateSubtext(filterType)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 8,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        textAlign: 'center',
    },
});