import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    Alert,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { BookmarkItem } from '../../hooks/useBookmarks';
import { getResponsiveHTML } from '../../scripts/htmlGenerators';

interface Props {
    visible: boolean;
    item: BookmarkItem | null;
    fileType: string;
    onClose: () => void;
}

export const PreviewModal: React.FC<Props> = ({ visible, item, fileType, onClose }) => {
    if (!item) return null;

    return (
        <Modal 
            visible={visible} 
            transparent={true} 
            animationType="slide" 
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalDragIndicator} />
                    <View style={styles.modalHeader}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.modalTitle} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {fileType.toUpperCase()} Asset Resource
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={onClose} 
                            style={styles.closeButton} 
                            activeOpacity={0.7}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.previewContainer}>
                        {item.id ? (
                            <WebView
                                source={{ html: getResponsiveHTML(item.id, fileType) }}
                                style={styles.webView}
                                startInLoadingState={true}
                                renderLoading={() => (
                                    <View style={styles.webViewLoading}>
                                        <Text style={styles.loadingSubtext}>
                                            {fileType === 'pdf' ? 'Loading PDF...' : 'Loading file...'}
                                        </Text>
                                    </View>
                                )}
                                onError={() => {
                                    Alert.alert('Preview Error', 'Could not load resource. Open via browser?', [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Open Browser', onPress: () => WebBrowser.openBrowserAsync(`https://drive.google.com/file/d/${item.id}/view`) }
                                    ]);
                                }}
                                javaScriptEnabled 
                                domStorageEnabled 
                                scalesPageToFit 
                                mixedContentMode="always" 
                                allowsFullscreenVideo
                            />
                        ) : (
                            <View style={styles.centerContainer}>
                                <Text style={styles.emptyText}>No preview available</Text>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#121212',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        paddingTop: Platform.OS === 'ios' ? 12 : 0,
    },
    modalDragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#444',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 2,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#2d2d2d',
    },
    titleWrapper: {
        flex: 1,
        marginRight: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 2,
    },
    modalSubtitle: {
        fontSize: 11,
        color: '#9aa0a6',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    closeButton: {
        padding: 0,
        borderRadius: 18,
        backgroundColor: '#2d2d2d',
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 14,
        color: '#e8eaed',
        fontWeight: 'normal',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    webView: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    webViewLoading: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingSubtext: {
        marginTop: 12,
        color: '#9aa0a6',
        fontSize: 13,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#70757a',
        fontSize: 15,
        fontWeight: '500',
    },
});