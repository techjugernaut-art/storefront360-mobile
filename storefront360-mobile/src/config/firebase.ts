// Firebase Web Configuration
// This file initializes Firebase for the web/mobile app

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { Platform } from 'react-native';

// TODO: Replace with your actual Firebase configuration
// Get these values from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'YOUR_APP_ID',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'YOUR_MEASUREMENT_ID'
};

// TODO: Get your VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY';

let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;

/**
 * Initialize Firebase
 * Only initialize on web platform (not React Native)
 */
export const initializeFirebase = (): FirebaseApp | null => {
  // Only initialize on web platform
  if (Platform.OS !== 'web') {
    console.log('[Firebase] Skipping initialization on native platform');
    return null;
  }

  try {
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
      console.log('[Firebase] Initialized successfully');
    }
    return firebaseApp;
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    return null;
  }
};

/**
 * Get Firebase Messaging instance
 */
export const getFirebaseMessaging = (): Messaging | null => {
  if (Platform.OS !== 'web') {
    console.log('[Firebase] Messaging not available on native platform');
    return null;
  }

  try {
    if (!messaging && firebaseApp) {
      messaging = getMessaging(firebaseApp);
    }
    return messaging;
  } catch (error) {
    console.error('[Firebase] Error getting messaging instance:', error);
    return null;
  }
};

/**
 * Request notification permission from the user
 * @returns {Promise<NotificationPermission>} Permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (Platform.OS !== 'web') {
    console.log('[Firebase] Notifications not available on native platform');
    return 'denied';
  }

  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('[Firebase] Notifications not supported in this browser');
      return 'denied';
    }

    // Check current permission
    if (Notification.permission === 'granted') {
      console.log('[Firebase] Notification permission already granted');
      return 'granted';
    }

    // Request permission
    const permission = await Notification.requestPermission();
    console.log('[Firebase] Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('[Firebase] Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * Get FCM token for the current device
 * This token is used to send push notifications to this specific device
 * @returns {Promise<string | null>} FCM token or null if failed
 */
export const getFCMToken = async (): Promise<string | null> => {
  if (Platform.OS !== 'web') {
    console.log('[Firebase] FCM token not available on native platform');
    return null;
  }

  try {
    // Initialize Firebase if not already done
    if (!firebaseApp) {
      initializeFirebase();
    }

    // Get messaging instance
    const messagingInstance = getFirebaseMessaging();
    if (!messagingInstance) {
      console.error('[Firebase] Messaging instance not available');
      return null;
    }

    // Request notification permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('[Firebase] Notification permission not granted');
      return null;
    }

    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('[Firebase] Service Worker registered:', registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
    }

    // Get FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: vapidKey,
    });

    if (token) {
      console.log('[Firebase] FCM token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('[Firebase] No FCM token available');
      return null;
    }
  } catch (error) {
    console.error('[Firebase] Error getting FCM token:', error);
    return null;
  }
};

/**
 * Set up foreground message handler
 * This handles notifications when the app is in the foreground
 * @param {Function} callback - Callback function to handle the message
 */
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (Platform.OS !== 'web') {
    console.log('[Firebase] Foreground messages not available on native platform');
    return () => {};
  }

  try {
    const messagingInstance = getFirebaseMessaging();
    if (!messagingInstance) {
      console.error('[Firebase] Messaging instance not available');
      return () => {};
    }

    // Set up message handler
    const unsubscribe = onMessage(messagingInstance, (payload) => {
      console.log('[Firebase] Foreground message received:', payload);
      callback(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error('[Firebase] Error setting up foreground message handler:', error);
    return () => {};
  }
};

/**
 * Check if Firebase is properly configured
 * @returns {boolean} True if Firebase is configured
 */
export const isFirebaseConfigured = (): boolean => {
  return (
    firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
    firebaseConfig.projectId !== 'YOUR_PROJECT_ID' &&
    vapidKey !== 'YOUR_VAPID_KEY'
  );
};

/**
 * Subscribe to a topic for push notifications
 * Note: Topic subscription must be done on the backend using Firebase Admin SDK
 * This is just a helper to send the request to your backend
 * @param {string} token - FCM token
 * @param {string} topic - Topic name to subscribe to
 */
export const subscribeToTopic = async (token: string, topic: string): Promise<boolean> => {
  // This should be implemented on your backend
  // The frontend cannot directly subscribe to topics
  console.log(`[Firebase] Topic subscription should be done on backend: token=${token.substring(0, 20)}..., topic=${topic}`);
  return false;
};

// Initialize Firebase on module load
if (Platform.OS === 'web') {
  initializeFirebase();
}

export default {
  initializeFirebase,
  getFirebaseMessaging,
  requestNotificationPermission,
  getFCMToken,
  onForegroundMessage,
  isFirebaseConfigured,
  subscribeToTopic,
};
