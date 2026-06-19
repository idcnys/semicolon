import { ChevronRight, Home } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
    title: string;
    folderStack: string[];
    folderNames: Record<string, string>;
    onBreadcrumbPress: (index: number) => void;
}

export const FolderHeader: React.FC<Props> = ({ 
    title, 
    folderStack, 
    folderNames, 
    onBreadcrumbPress 
}) => {
    const breadcrumbScrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        breadcrumbScrollViewRef.current?.scrollToEnd({ animated: true });
    }, [folderStack]);

    return (
        <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>
            <ScrollView
                horizontal
                ref={breadcrumbScrollViewRef}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.breadcrumbContainer}
            >
                <TouchableOpacity onPress={() => onBreadcrumbPress(-1)} style={styles.crumbTouch}>
                    <Home size={16} color={folderStack.length === 0 ? '#5f6368' : '#1a73e8'} />
                </TouchableOpacity>
                {folderStack.map((folderId, index) => {
                    const isLast = index === folderStack.length - 1;
                    return (
                        <View key={folderId} style={styles.crumbWrapper}>
                            <ChevronRight size={14} color="#9aa0a6" style={styles.crumbSeparator} />
                            <TouchableOpacity 
                                onPress={() => onBreadcrumbPress(index)} 
                                disabled={isLast} 
                                style={styles.crumbTouch}
                            >
                                <Text style={[styles.crumbText, isLast && styles.activeCrumbText]}>
                                    {folderNames[folderId] || 'Folder'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { 
        paddingHorizontal: 16, 
        paddingTop: 24, 
        paddingBottom: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#e8eaed', 
        backgroundColor: '#fff' 
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#202124', 
        marginBottom: 8 
    },
    breadcrumbContainer: { 
        alignItems: 'center', 
        paddingVertical: 4, 
        flexDirection: 'row' 
    },
    crumbWrapper: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    crumbTouch: { 
        paddingVertical: 4, 
        paddingHorizontal: 2, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    crumbText: { 
        fontSize: 14, 
        color: '#1a73e8', 
        fontWeight: '500' 
    },
    activeCrumbText: { 
        color: '#5f6368', 
        fontWeight: 'normal' 
    },
    crumbSeparator: { 
        marginHorizontal: 2 
    },
});