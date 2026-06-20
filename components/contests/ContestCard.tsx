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

    // Check if contest has started
    const hasStarted = contest.startsIn === '0' || contest.startsIn === 'Started';
    
    // Get platform color based on contest platform
    const getPlatformColor = (platform?: string) => {
        switch (platform?.toLowerCase()) {
            case 'codeforces':
                return '#1F8ACB';
            case 'codechef':
                return '#D0A74F';
            case 'leetcode':
                return '#FFA116';
            case 'atcoder':
                return '#222222';
            default:
                return '#64748B';
        }
    };

    // Get platform background color
    const getPlatformBgColor = (platform?: string) => {
        switch (platform?.toLowerCase()) {
            case 'codeforces':
                return '#E8F4FD';
            case 'codechef':
                return '#FDF6E3';
            case 'leetcode':
                return '#FFF8E8';
            case 'atcoder':
                return '#F0F0F0';
            default:
                return '#F1F5F9';
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <View style={[styles.card, hasStarted && styles.cardStarted]}>
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
                            {/* Only show "Starts in" if not started */}
                            {!hasStarted && (
                                <View style={styles.detailItem}>
                                    <Timer size={14} color="#64748B" />
                                    <Text style={styles.detailText}>
                                        Starts in {contest.startsIn}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={styles.detailItem}>
                                <Clock size={14} color="#64748B" />
                                <Text style={styles.detailText}>
                                    {contest.duration}
                                </Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.cardFooter}>
                        <View style={styles.tagsContainer}>
                            {/* Status Badge */}
                            <View style={[styles.statusBadge, hasStarted && styles.statusBadgeStarted]}>
                                <Zap size={12} color={hasStarted ? "#991B1B" : "#166534"} />
                                <Text style={[styles.statusText, hasStarted && styles.statusTextStarted]}>
                                    {hasStarted ? 'Started' : 'Upcoming'}
                                </Text>
                            </View>
                            
                            {/* Platform Tag */}
                            {contest.platform && (
                                <View style={[
                                    styles.platformTag, 
                                    { backgroundColor: getPlatformBgColor(contest.platform) }
                                ]}>
                                    <Text style={[
                                        styles.platformText,
                                        { color: getPlatformColor(contest.platform) }
                                    ]}>
                                        {contest.platform}
                                    </Text>
                                </View>
                            )}
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
    cardStarted: {
        borderColor: '#EF4444',
        borderWidth: 2,
        backgroundColor: '#FEF2F2',
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
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: 16,
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
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
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
    statusBadgeStarted: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#166534',
        marginLeft: 4,
    },
    statusTextStarted: {
        color: '#991B1B',
    },
    platformTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    platformText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    linkIcon: {
        padding: 4,
    },
});