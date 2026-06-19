import { useState } from 'react';
import { Alert } from 'react-native';
import { DEFAULT_COVER_STATE } from '../constants/cover';
import { generatePDF } from '../scripts/coverExport';
import { generateCoverHTML } from '../scripts/coverGenerator';
import { CoverState } from '../types/cover';

export const useCoverGenerator = () => {
    const [state, setState] = useState<CoverState>(DEFAULT_COVER_STATE);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedHTML, setGeneratedHTML] = useState<string>('');
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showExpDatePicker, setShowExpDatePicker] = useState(false);
    const [showSubDatePicker, setShowSubDatePicker] = useState(false);

    const handleChange = <K extends keyof CoverState>(field: K, value: CoverState[K]): void => {
        setState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleGenerate = (): void => {
        const { studentName, studentRoll } = state;
        if (!studentName.trim() || !studentRoll.trim()) {
            Alert.alert('Error', 'Please enter both Student Name and Roll.');
            return;
        }
        const html = generateCoverHTML(state, true);
        setGeneratedHTML(html);
        setShowFullPreview(true);
    };

    const handleGeneratePDF = async (): Promise<void> => {
        const { studentName, studentRoll } = state;
        if (!studentName.trim() || !studentRoll.trim()) {
            Alert.alert('Error', 'Please enter both Student Name and Roll.');
            return;
        }

        setIsGenerating(true);
        try {
            const html = generateCoverHTML(state, false);
            const fileName = `Cover_${studentRoll}`;
            await generatePDF(html, fileName);
        } catch (error) {
            console.error('PDF generation error:', error);
            Alert.alert('Error', 'Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const closePreview = (): void => {
        setShowFullPreview(false);
    };

    const setExpDatePicker = (show: boolean) => setShowExpDatePicker(show);
    const setSubDatePicker = (show: boolean) => setShowSubDatePicker(show);

    return {
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
    };
};