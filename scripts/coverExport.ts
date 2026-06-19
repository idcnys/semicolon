import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const generatePDF = async (html: string, fileName: string): Promise<string | null> => {
    try {
        const { uri } = await Print.printToFileAsync({
            html: html,
            base64: false,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: `${fileName}.pdf`,
            });
            return uri;
        } else {
            const fileUri = FileSystem.documentDirectory 
                ? `${FileSystem.documentDirectory}${fileName}.pdf`
                : `${FileSystem.cacheDirectory}${fileName}.pdf`;
            
            await FileSystem.copyAsync({
                from: uri,
                to: fileUri,
            });
            Alert.alert('Success', `PDF saved to: ${fileUri}`);
            return fileUri;
        }
    } catch (error) {
        console.error('PDF generation error:', error);
        Alert.alert('Error', 'Failed to generate PDF. Please try again.');
        return null;
    }
};