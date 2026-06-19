import { Plus, Search } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getGreeting, getStats } from '../../scripts/todoHelpers';
import { Todo } from '../../types/todos';

interface TodoHeaderProps {
    todos: Todo[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddPress: () => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
    todos,
    searchQuery,
    onSearchChange,
    onAddPress,
}) => {
    const stats = getStats(todos);

    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.statsText}>
                            {stats.pending} pending · {stats.completed} done
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddPress}
                        activeOpacity={0.8}
                    >
                        <Plus size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search tasks..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={onSearchChange}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerContent: {
        gap: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        letterSpacing: -0.3,
    },
    statsText: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1F2937',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
        marginTop: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
        paddingVertical: 8,
    },
});