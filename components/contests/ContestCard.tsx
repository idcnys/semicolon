import {
    Calendar,
    ChevronRight,
    Clock,
    Code,
    ExternalLink,
    Timer,
    Zap,
} from 'lucide-react-native';
import React from 'react';
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Contest } from '../../types/contests';

interface Props {
    contest: Contest;
}

export const ContestCard: React.FC<Props> = ({ contest }) => {
    const handlePress = () => {
        if (contest.url) {
            Linking.openURL(contest.url).catch(err => 
                console.error('Failed to open URL:', err)
            );
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconWrapper}>
                            <Code size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.eventText} numberOfLines={1}>
                            {contest.event}
                        </Text>
                        <ChevronRight size={16} color="#94A3B8" />
                    </View>
                    
                    <View style={styles.cardDetails}>
                        <View style={styles.detailItem}>
                            <Calendar size={14} color="#64748B" />
                            <Text style={styles.detailText}>
                                {contest.startDate} at {contest.time}
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Timer size={14} color="#64748B" />
                                <Text style={styles.detailText}>
                                    Starts in {contest.startsIn}
                                </Text>
                            </View>
                            
                            <View style={styles.detailItem}>
                                <Clock size={14} color="#64748B" />
                                <Text style={styles.detailText}>
                                    {contest.duration}
                                </Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.cardFooter}>
                        <View style={styles.statusBadge}>
                            <Zap size={12} color="#166534" />
                            <Text style={styles.statusText}>Upcoming</Text>
                        </View>
                        <View style={styles.linkIcon}>
                            <ExternalLink size={16} color="#64748B" />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    iconWrapper: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        flex: 1,
    },
    cardDetails: {
        gap: 6,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#475569',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#166534',
        marginLeft: 4,
    },
    linkIcon: {
        padding: 4,
    },
});