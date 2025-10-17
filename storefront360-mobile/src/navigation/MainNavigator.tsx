import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/config';

// Screens
import HomeScreen from '../screens/HomeScreen';
import POSScreen from '../screens/POSScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Custom center button component
function CustomTabBarButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.customButton}>{children}</View>
    </TouchableOpacity>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: 24 }}>{focused ? '🏠' : '🏠'}</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="POS"
        component={POSScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 28, color: COLORS.surface }}>+</Text>
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: 24 }}>{focused ? '⚙️' : '⚙️'}</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
