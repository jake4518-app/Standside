import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import LogMatchScreen from '../screens/LogMatchScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProgrammesScreen from '../screens/ProgrammesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';

import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }) {
  const tabs = [
    { name: 'Home', icon: '🏠', label: 'Home' },
    { name: 'Community', icon: '👥', label: 'Community' },
    { name: 'LogMatch', icon: '➕', label: 'Log' },
    { name: 'Programmes', icon: '📚', label: 'Programmes' },
    { name: 'Profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const routeIndex = state.routes.findIndex(r => r.name === tab.name);
        const isFocused = state.index === routeIndex;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <View style={[styles.tabDot, isFocused && styles.tabDotActive]} />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Tab Navigator ────────────────────────────────────────────────────────────
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="LogMatch" component={LogMatchScreen} />
      <Tab.Screen name="Programmes" component={ProgrammesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="MatchDetail"
          component={MatchDetailScreen}
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#D8E8DC',
    paddingTop: 8,
    paddingBottom: 28, // safe area
  },
  tabItem: {
    flex: 1, alignItems: 'center', gap: 2, paddingVertical: 4,
  },
  tabIcon: { fontSize: 20 },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'transparent' },
  tabDotActive: { backgroundColor: colors.green },
  tabLabel: {
    fontSize: 9, fontWeight: '600', color: '#6B7A6E',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  tabLabelActive: { color: colors.green },
});
