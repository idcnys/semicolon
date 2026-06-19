import { Award } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    date: string;
    count: number;
}

export const DateHeader: React.FC<Props> = ({ date, count }) => {
    return (
        <View style={styles.dateHeader}>
            <Award size={18} color="#2563EB" />
            <Text style={styles.dateText}>
                {date} • {count} event{count > 1 ? 's' : ''}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        marginBottom: 8,
        gap: 8,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
});