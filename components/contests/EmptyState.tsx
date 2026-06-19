import { AlertCircle, RefreshCw } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
    onRefresh: () => void;
}

export const EmptyState: React.FC<Props> = ({ onRefresh }) => {
    return (
        <View style={styles.emptyContainer}>
            <AlertCircle size={40} color="#94A3B8" />
            <Text style={styles.emptyText}>No upcoming contests found.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                <RefreshCw size={16} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#64748B',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
        marginTop: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});