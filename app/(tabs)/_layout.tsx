import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        // Add this to remove the top border and adjust padding
        tabBarStyle: {
          borderTopWidth: 0, // Removes the top border line
          elevation: 0,      // Removes shadow on Android
          shadowOpacity: 0,  // Removes shadow on iOS
          backgroundColor: '#FFFFFF', // Ensure this matches your screen background
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'CP Cal',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/cfcal.png')} 
              style={[styles.icon, { tintColor: focused ? '#007AFF' : '#8E8E93' }]} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="folder"
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/folder.png')} 
              style={[styles.icon, { tintColor: focused ? '#007AFF' : '#8E8E93' }]} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="cpgen"
        options={{
          title: 'CP Gen',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/cpg.png')} 
              style={[styles.icon, { tintColor: focused ? '#007AFF' : '#8E8E93' }]} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/hw.png')} 
              style={[styles.icon, { tintColor: focused ? '#007AFF' : '#8E8E93' }]} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});