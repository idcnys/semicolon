import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
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
        name="bookmark"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/bookmark.png')} 
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