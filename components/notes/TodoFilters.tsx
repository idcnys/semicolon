import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FILTERS } from '../../constants/todos';
import { FilterType } from '../../types/todos';

interface TodoFiltersProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
    currentFilter,
    onFilterChange,
}) => {
    return (
        <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {FILTERS.map((filter) => (
                    <TouchableOpacity
                        key={filter.value}
                        style={[
                            styles.filterButton,
                            currentFilter === filter.value && styles.filterButtonActive,
                        ]}
                        onPress={() => onFilterChange(filter.value)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                currentFilter === filter.value && styles.filterTextActive,
                            ]}
                        >
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#F3F4F6',
    },
    filterButtonActive: {
        backgroundColor: '#1F2937',
    },
    filterText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
});