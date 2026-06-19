import { Folder } from 'lucide-react-native';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { RootFolder } from '../../types/drive';

interface Props {
    folder: RootFolder;
    onPress: (id: string) => void;
}

export const FolderCard: React.FC<Props> = ({ folder, onPress }) => {
    const { width } = useWindowDimensions();
    const cardWidth = (width - 48) / 2;

    return (
        <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => onPress(folder.id)}
            activeOpacity={0.7}
        >
            <View style={styles.cardIconContainer}>
                <Folder size={40} color="#4285F4" fill="#4285F4" fillOpacity={0.15} />
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>{folder.name}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{folder.description}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e8eaed',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
            android: { elevation: 2 }
        })
    },
    cardIconContainer: { 
        marginBottom: 12 
    },
    cardTitle: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#202124', 
        marginBottom: 4 
    },
    cardDescription: { 
        fontSize: 12, 
        color: '#5f6368', 
        lineHeight: 16 
    },
});