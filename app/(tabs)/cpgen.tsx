import { StatusBar } from 'expo-status-bar';
import { BookOpen } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoverForm } from '../../components/cover/CoverForm';
import { CoverPreviewModal } from '../../components/cover/CoverPreviewModal';
import { useCoverGenerator } from '../../hooks/useCoverGenerator';

export default function CoverPageGenerator() {
    const {
        state,
        isGenerating,
        generatedHTML,
        showFullPreview,
        showExpDatePicker,
        showSubDatePicker,
        handleChange,
        handleGenerate,
        handleGeneratePDF,
        closePreview,
        setExpDatePicker,
        setSubDatePicker,
    } = useCoverGenerator();

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.headerIconContainer}>
                        <BookOpen size={22} color="#2a7de1" />
                    </View>
                    <View>
                        <Text style={styles.title}>Cover Page Generator</Text>
                        <Text style={styles.subtitle}>Faster, Offline, Secure </Text>
                    </View>
                </View>

                <CoverForm
                    state={state}
                    showExpDatePicker={showExpDatePicker}
                    showSubDatePicker={showSubDatePicker}
                    onFieldChange={handleChange}
                    onExpDatePickerChange={setExpDatePicker}
                    onSubDatePickerChange={setSubDatePicker}
                    onPreview={handleGenerate}
                    onGeneratePDF={handleGeneratePDF}
                    isGenerating={isGenerating}
                />
            </ScrollView>

            <CoverPreviewModal
                visible={showFullPreview}
                html={generatedHTML}
                isGenerating={isGenerating}
                onClose={closePreview}
                onGeneratePDF={handleGeneratePDF}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 18,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e8ecf1',
    },
    headerIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#e8f0fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a2634',
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 12,
        color: '#6b7a8a',
        fontWeight: '400',
        marginTop: 1,
        letterSpacing: 0.2,
    },
});