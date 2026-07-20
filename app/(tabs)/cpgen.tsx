import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoverForm } from '../../components/cover/CoverForm';
import { CoverPreviewModal } from '../../components/cover/CoverPreviewModal';
import { useCoverGenerator } from '../../hooks/useCoverGenerator';

const PROFILE_STORAGE_KEY = 'cover_page_user_profile';

const getSectionFromRoll = (roll: string): string => {
    const rollStr = roll.toString().padStart(7, '0');
    const lastThree = parseInt(rollStr.slice(-3));
    
    if (lastThree >= 1 && lastThree <= 60) return 'A';
    else if (lastThree >= 61 && lastThree <= 120) return 'B';
    else if (lastThree >= 121 && lastThree <= 180) return 'C';
    return 'A';
};

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

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', roll: '' });
    const [savedProfile, setSavedProfile] = useState<typeof profileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const profileJson = await SecureStore.getItemAsync(PROFILE_STORAGE_KEY);
            if (profileJson) {
                const profile = JSON.parse(profileJson);
                setSavedProfile(profile);
                setProfileData(profile);
                handleChange('studentName', profile.name);
                handleChange('studentRoll', profile.roll);
                handleChange('section', getSectionFromRoll(profile.roll));
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveProfileToStorage = async (profile: typeof profileData) => {
        try {
            await SecureStore.setItemAsync(PROFILE_STORAGE_KEY, JSON.stringify(profile));
            setSavedProfile(profile);
            setProfileData(profile);
            handleChange('studentName', profile.name);
            handleChange('studentRoll', profile.roll);
            const section = getSectionFromRoll(profile.roll);
            handleChange('section', section);
            setShowProfileModal(false);
            Alert.alert('Success', `Profile saved! Section ${section}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    const handleSaveProfile = () => {
        if (!profileData.name || !profileData.roll) {
            Alert.alert('Required', 'Name and Roll Number are required');
            return;
        }
        if (!/^\d{7}$/.test(profileData.roll)) {
            Alert.alert('Invalid', 'Roll number must be 7 digits');
            return;
        }
        saveProfileToStorage(profileData);
    };

    const handleClearProfile = async () => {
        try {
            await SecureStore.deleteItemAsync(PROFILE_STORAGE_KEY);
            setSavedProfile(null);
            setProfileData({ name: '', roll: '' });
            handleChange('studentName', '');
            handleChange('studentRoll', '');
            handleChange('section', 'A');
            Alert.alert('Success', 'Profile cleared');
        } catch (error) {
            Alert.alert('Error', 'Failed to clear profile');
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />
            
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} activeOpacity={0.7}>
                    <View style={styles.headerIconContainer}>
                        <BookOpen size={20} color="#007AFF" />
                    </View>
                    <Text style={styles.title}>Cover Page</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => setShowProfileModal(true)}
                    activeOpacity={0.7}
                >
                    <User size={18} color="#007AFF" />
                    {savedProfile && <View style={styles.profileDot} />}
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
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

            <Modal
                visible={showProfileModal}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowProfileModal(false)}
            >
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                onPress={() => setShowProfileModal(false)}
                                style={styles.modalCloseButton}
                            >
                                <X size={22} color="#8E8E93" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Profile</Text>
                            <View style={styles.modalPlaceholder} />
                        </View>

                        <ScrollView 
                            style={styles.modalScroll}
                            contentContainerStyle={styles.modalScrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {savedProfile && (
                                <View style={styles.savedProfileCard}>
                                    <View style={styles.savedProfileHeader}>
                                        <Text style={styles.savedProfileTitle}>Active Profile</Text>
                                        <TouchableOpacity 
                                            onPress={handleClearProfile}
                                        >
                                            <Text style={styles.clearButtonText}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.savedProfileInfo}>
                                        <View style={styles.savedProfileItem}>
                                            <Text style={styles.savedProfileKey}>Name</Text>
                                            <Text style={styles.savedProfileValue}>{savedProfile.name}</Text>
                                        </View>
                                        <View style={styles.savedProfileItem}>
                                            <Text style={styles.savedProfileKey}>Roll</Text>
                                            <Text style={styles.savedProfileValue}>{savedProfile.roll}</Text>
                                        </View>
                                        <View style={styles.savedProfileItem}>
                                            <Text style={styles.savedProfileKey}>Section</Text>
                                            <View style={styles.sectionChip}>
                                                <Text style={styles.sectionChipText}>
                                                    {getSectionFromRoll(savedProfile.roll)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.name}
                                    onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#B0B0B0"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Roll Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.roll}
                                    onChangeText={(text) => {
                                        const numericText = text.replace(/[^0-9]/g, '');
                                        setProfileData({ ...profileData, roll: numericText });
                                    }}
                                    placeholder="Enter 7-digit roll"
                                    placeholderTextColor="#B0B0B0"
                                    keyboardType="numeric"
                                    maxLength={7}
                                />
                                {profileData.roll && /^\d{7}$/.test(profileData.roll) && (
                                    <View style={styles.sectionPreview}>
                                        <Text style={styles.sectionPreviewText}>
                                            Section <Text style={styles.sectionPreviewHighlight}>
                                                {getSectionFromRoll(profileData.roll)}
                                            </Text>
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity 
                                style={styles.saveButton}
                                onPress={handleSaveProfile}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.saveButtonText}>
                                    {savedProfile ? 'Update Profile' : 'Save Profile'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F5F5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    profileButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    profileDot: {
        position: 'absolute',
        top: 7,
        right: 7,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        borderWidth: 1.5,
        borderColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        fontSize: 14,
        color: '#8E8E93',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    keyboardView: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F5F5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    modalCloseButton: {
        padding: 6,
    },
    modalPlaceholder: {
        width: 34,
    },
    modalScroll: {
        flex: 1,
    },
    modalScrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30,
    },
    savedProfileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    savedProfileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    savedProfileTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8E8E93',
        letterSpacing: 0.2,
    },
    savedProfileInfo: {
        gap: 8,
    },
    savedProfileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    savedProfileKey: {
        fontSize: 14,
        color: '#8E8E93',
    },
    savedProfileValue: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    sectionChip: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 12,
    },
    sectionChipText: {
        color: '#1A1A1A',
        fontSize: 13,
        fontWeight: '500',
    },
    clearButtonText: {
        fontSize: 13,
        color: '#FF6B6B',
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1A1A1A',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 0,
    },
    sectionPreview: {
        marginTop: 8,
        paddingVertical: 5,
        paddingHorizontal: 12,
        backgroundColor: '#F0F7FF',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    sectionPreviewText: {
        fontSize: 13,
        color: '#1A1A1A',
    },
    sectionPreviewHighlight: {
        fontWeight: '600',
        color: '#0066CC',
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: '#0066CC',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#0066CC',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});