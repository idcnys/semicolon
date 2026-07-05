import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
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

// Map roll ranges to sections
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
                <View style={styles.headerLeft}>
                    <View style={styles.headerIconContainer}>
                        <BookOpen size={22} color="#007AFF" />
                    </View>
                    <View>
                        <Text style={styles.title}>Cover Page</Text>
                        <Text style={styles.subtitle}>Faster • Offline • Secure</Text>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => setShowProfileModal(true)}
                    activeOpacity={0.7}
                >
                    <User size={20} color="#007AFF" />
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

            {/* Native Profile Modal */}
            <Modal
                visible={showProfileModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowProfileModal(false)}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <Pressable 
                        style={styles.modalBackdrop} 
                        onPress={() => setShowProfileModal(false)}
                    />
                    
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                onPress={() => setShowProfileModal(false)}
                                style={styles.modalCloseButton}
                            >
                                <X size={24} color="#007AFF" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Profile</Text>
                            <View style={styles.modalPlaceholder} />
                        </View>

                        {savedProfile && (
                            <View style={styles.savedProfileCard}>
                                <View style={styles.savedProfileRow}>
                                    <Text style={styles.savedProfileLabel}>Active Profile</Text>
                                    <TouchableOpacity 
                                        onPress={handleClearProfile}
                                        style={styles.clearButton}
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
                                placeholder="Enter your full name"
                                placeholderTextColor="#C7C7CC"
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
                                placeholderTextColor="#C7C7CC"
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
                            activeOpacity={0.8}
                        >
                            <Text style={styles.saveButtonText}>
                                {savedProfile ? 'Update Profile' : 'Save Profile'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F2F2F7',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#E8F0FE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: '400',
        marginTop: 1,
        letterSpacing: 0.3,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F0FE',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    profileDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#34C759',
        borderWidth: 2,
        borderColor: '#F2F2F7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    loadingText: {
        fontSize: 16,
        color: '#8E8E93',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    modalCloseButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    modalPlaceholder: {
        width: 32,
    },
    savedProfileCard: {
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        marginBottom: 16,
    },
    savedProfileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    savedProfileLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    savedProfileInfo: {
        gap: 8,
    },
    savedProfileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    savedProfileKey: {
        fontSize: 14,
        color: '#8E8E93',
    },
    savedProfileValue: {
        fontSize: 14,
        color: '#1C1C1E',
        fontWeight: '500',
    },
    sectionChip: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 12,
    },
    sectionChipText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#FF3B30',
        borderRadius: 6,
    },
    clearButtonText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1C1C1E',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1C1C1E',
        minHeight: 44,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    sectionPreview: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#E8F0FE',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    sectionPreviewText: {
        fontSize: 13,
        color: '#1C1C1E',
    },
    sectionPreviewHighlight: {
        fontWeight: '700',
        color: '#007AFF',
        fontSize: 15,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
});