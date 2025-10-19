import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/navigation/MainNavigator';
import WebContainer from './src/components/WebContainer';
import { COLORS } from './src/constants/config';
import { initializeNotifications, onNotification } from './src/services/notifications';

export default function App() {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    // Load user from storage on app start
    loadUser();

    // Register service worker and initialize notifications (web only)
    if (Platform.OS === 'web') {
      registerServiceWorker();
      setupNotifications();
    }
  }, []);

  // Register service worker for PWA functionality
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        // Register the main service worker
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        console.log('Service Worker registered successfully:', registration.scope);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, prompt user to reload
                console.log('New service worker available. Reload to update.');
                // You can show a notification here to prompt user to reload
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('Message from service worker:', event.data);

          if (event.data.type === 'NOTIFICATION_CLICK') {
            // Handle notification click routing
            console.log('Notification clicked, navigating to:', event.data.url);
            // You can use navigation here if needed
          }

          if (event.data.type === 'SYNC_COMPLETE') {
            console.log('Offline sync completed:', event.data.results);
            // Handle sync completion
          }
        });

        // Check for service worker updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.log('Service Workers are not supported in this browser');
    }
  };

  // Setup push notifications
  const setupNotifications = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping notification setup');
      return;
    }

    try {
      const initialized = await initializeNotifications();

      if (initialized) {
        console.log('Notifications initialized successfully');

        // Subscribe to notification events
        const unsubscribe = onNotification((payload) => {
          console.log('Notification received in app:', payload);

          // Handle different notification types
          // You can show in-app alerts, update UI, etc.
          if (payload.notification) {
            const { title, body } = payload.notification;
            console.log(`Notification: ${title} - ${body}`);
          }
        });

        // Clean up on unmount
        return () => {
          unsubscribe();
        };
      } else {
        console.log('Failed to initialize notifications');
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  // Re-initialize notifications when user logs in
  useEffect(() => {
    if (isAuthenticated && Platform.OS === 'web') {
      setupNotifications();
    }
  }, [isAuthenticated]);

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <WebContainer>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </WebContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <WebContainer>
        <NavigationContainer>
          {isAuthenticated ? <MainNavigator /> : <LoginScreen />}
        </NavigationContainer>
      </WebContainer>
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
