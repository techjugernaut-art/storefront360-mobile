import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/navigation/MainNavigator';
import { COLORS } from './src/constants/config';

export default function App() {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    // Load user from storage on app start
    loadUser();
  }, []);

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <LoginScreen />}
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
