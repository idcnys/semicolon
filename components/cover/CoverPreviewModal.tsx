import { FileText, X } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface CoverPreviewModalProps {
    visible: boolean;
    html: string;
    isGenerating: boolean;
    onClose: () => void;
    onGeneratePDF: () => void;
}

export const CoverPreviewModal: React.FC<CoverPreviewModalProps> = ({
    visible,
    html,
    isGenerating,
    onClose,
    onGeneratePDF,
}) => {
    const screenWidth = Dimensions.get('window').width;

    if (!visible || !html) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Cover Page Preview</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.modalCloseButton}
                    >
                        <X size={24} color="#1e2a3a" />
                    </TouchableOpacity>
                </View>
                <View style={styles.webViewContainer}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html }}
                        style={[
                            styles.modalWebview,
                            { width: screenWidth > 600 ? Math.min(screenWidth * 0.9, 800) : screenWidth - 20 }
                        ]}
                        scalesPageToFit={true}
                        scrollEnabled={true}
                        bounces={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        onMessage={() => {}}
                        injectedJavaScript={`
                            const metaViewport = document.querySelector('meta[name=viewport]');
                            if (metaViewport) {
                                const screenWidth = window.innerWidth;
                                const containerWidth = 210;
                                const scale = Math.min(1, (screenWidth - 40) / (containerWidth * 3.78));
                                metaViewport.content = 'width=device-width, initial-scale=' + scale + ', maximum-scale=1.5, user-scalable=yes';
                            }
                        `}
                    />
                </View>
                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.modalButtonSuccess]}
                        onPress={onGeneratePDF}
                        disabled={isGenerating}
                    >
                        <FileText size={20} color="white" />
                        <Text style={styles.modalButtonText}>
                            {isGenerating ? 'Generating...' : 'Generate PDF'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e6edf6',
        backgroundColor: '#f8faff',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e2a3a',
    },
    modalCloseButton: {
        padding: 4,
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: '#e8ecf0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    modalWebview: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        aspectRatio: 210 / 297,
        maxWidth: 800,
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e6edf6',
        backgroundColor: '#f8faff',
    },
    modalButton: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonSuccess: {
        backgroundColor: '#1d9c5e',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});