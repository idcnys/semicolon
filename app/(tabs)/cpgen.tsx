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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="auto" />
            <ScrollView style={styles.container}>
                <View style={styles.app}>
                    <View style={styles.header}>
                        <BookOpen size={28} color="#2a7de1" />
                        <Text style={styles.title}>Cover Page Generator</Text>
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
                </View>
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
        backgroundColor: '#f0f2f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    app: {
        flex: 1,
        padding: 15,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
        marginBottom: 20,
        paddingBottom: 18,
        borderBottomWidth: 2,
        borderBottomColor: '#eef2f7',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        color: '#1e2a3a',
    },
});