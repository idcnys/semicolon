import { AlertCircle } from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
    type: 'loading' | 'error' | 'empty';
    error?: string | null;
    onRetry?: () => void;
}

export const FolderEmptyState: React.FC<Props> = ({ type, error, onRetry }) => {
    if (type === 'loading') {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4285F4" />
                <Text style={styles.loadingText}>Loading cloud items...</Text>
            </View>
        );
    }

    if (type === 'error') {
        return (
            <View style={styles.centerContainer}>
                <AlertCircle size={40} color="#EA4335" />
                <Text style={styles.errorText}>{error || 'Something went wrong.'}</Text>
                {onRetry && (
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Empty Folder</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    centerContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: 20 
    },
    loadingText: { 
        marginTop: 12, 
        color: '#5f6368', 
        fontSize: 15 
    },
    errorText: { 
        marginTop: 12, 
        color: '#EA4335', 
        textAlign: 'center', 
        marginBottom: 16 
    },
    emptyText: { 
        color: '#70757a', 
        fontSize: 15, 
        fontWeight: '500' 
    },
    retryButton: { 
        backgroundColor: '#4285F4', 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        borderRadius: 4, 
        marginTop: 10 
    },
    retryText: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
});