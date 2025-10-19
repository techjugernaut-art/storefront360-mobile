// Notification Service
// Handles push notification setup, subscription, and message handling

import { Platform } from 'react-native';
import {
  getFCMToken,
  onForegroundMessage,
  requestNotificationPermission,
  isFirebaseConfigured,
} from '../config/firebase';
import api from './api';

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  data?: {
    [key: string]: string;
  };
}

interface NotificationHandler {
  (payload: NotificationPayload): void;
}

let foregroundUnsubscribe: (() => void) | null = null;
let notificationHandlers: NotificationHandler[] = [];

/**
 * Initialize notification service
 * Sets up FCM token, requests permissions, and configures message handlers
 * @returns {Promise<boolean>} True if initialization was successful
 */
export const initializeNotifications = async (): Promise<boolean> => {
  // Only initialize on web platform
  if (Platform.OS !== 'web') {
    console.log('[Notifications] Skipping initialization on native platform');
    return false;
  }

  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    console.warn('[Notifications] Firebase is not properly configured. Please update firebase.ts with your credentials.');
    return false;
  }

  try {
    console.log('[Notifications] Initializing...');

    // Request notification permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('[Notifications] Permission not granted');
      return false;
    }

    // Get FCM token
    const token = await getFCMToken();
    if (!token) {
      console.error('[Notifications] Failed to get FCM token');
      return false;
    }

    // Send token to backend
    const success = await sendTokenToBackend(token);
    if (!success) {
      console.error('[Notifications] Failed to send token to backend');
      return false;
    }

    // Set up foreground message handler
    setupForegroundHandler();

    console.log('[Notifications] Initialized successfully');
    return true;
  } catch (error) {
    console.error('[Notifications] Initialization error:', error);
    return false;
  }
};

/**
 * Send FCM token to backend
 * The backend will store this token in the user's record for sending notifications
 * @param {string} token - FCM token
 * @returns {Promise<boolean>} True if successful
 */
export const sendTokenToBackend = async (token: string): Promise<boolean> => {
  try {
    // TODO: Update this endpoint to match your API
    const response = await api.post('/api/user/fcm-token', { fcmToken: token });

    if (response.data.success) {
      console.log('[Notifications] Token sent to backend successfully');
      return true;
    } else {
      console.error('[Notifications] Failed to send token to backend:', response.data);
      return false;
    }
  } catch (error) {
    console.error('[Notifications] Error sending token to backend:', error);
    return false;
  }
};

/**
 * Set up foreground message handler
 * Handles notifications when the app is open and in focus
 */
const setupForegroundHandler = () => {
  // Unsubscribe from previous handler if exists
  if (foregroundUnsubscribe) {
    foregroundUnsubscribe();
  }

  // Set up new handler
  foregroundUnsubscribe = onForegroundMessage((payload: NotificationPayload) => {
    console.log('[Notifications] Foreground message received:', payload);

    // Show in-app notification
    showInAppNotification(payload);

    // Call all registered handlers
    notificationHandlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (error) {
        console.error('[Notifications] Error in notification handler:', error);
      }
    });
  });
};

/**
 * Show in-app notification
 * Displays a browser notification even when the app is in the foreground
 * @param {NotificationPayload} payload - Notification payload
 */
const showInAppNotification = (payload: NotificationPayload) => {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const title = payload.notification?.title || 'Storefront 360';
  const options = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.image || '/icon.png',
    badge: '/badge.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    requireInteraction: false,
  };

  const notification = new Notification(title, options);

  // Handle notification click
  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    notification.close();

    // Handle notification action based on data
    if (payload.data?.url) {
      window.location.href = payload.data.url;
    }
  };

  // Auto-close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);
};

/**
 * Register a notification handler
 * Handlers are called when a foreground notification is received
 * @param {NotificationHandler} handler - Handler function
 * @returns {Function} Unsubscribe function
 */
export const onNotification = (handler: NotificationHandler): (() => void) => {
  notificationHandlers.push(handler);

  // Return unsubscribe function
  return () => {
    const index = notificationHandlers.indexOf(handler);
    if (index > -1) {
      notificationHandlers.splice(index, 1);
    }
  };
};

/**
 * Subscribe to a notification topic
 * Topics allow sending notifications to groups of users
 * @param {string} topic - Topic name (e.g., 'all-users', 'admin-alerts')
 * @returns {Promise<boolean>} True if successful
 */
export const subscribeToTopic = async (topic: string): Promise<boolean> => {
  try {
    // Get FCM token
    const token = await getFCMToken();
    if (!token) {
      console.error('[Notifications] No FCM token available');
      return false;
    }

    // TODO: Update this endpoint to match your API
    const response = await api.post('/api/notifications/subscribe', {
      topic,
      token,
    });

    if (response.data.success) {
      console.log(`[Notifications] Subscribed to topic: ${topic}`);
      return true;
    } else {
      console.error('[Notifications] Failed to subscribe to topic:', response.data);
      return false;
    }
  } catch (error) {
    console.error(`[Notifications] Error subscribing to topic ${topic}:`, error);
    return false;
  }
};

/**
 * Unsubscribe from a notification topic
 * @param {string} topic - Topic name
 * @returns {Promise<boolean>} True if successful
 */
export const unsubscribeFromTopic = async (topic: string): Promise<boolean> => {
  try {
    // Get FCM token
    const token = await getFCMToken();
    if (!token) {
      console.error('[Notifications] No FCM token available');
      return false;
    }

    // TODO: Update this endpoint to match your API
    const response = await api.post('/api/notifications/unsubscribe', {
      topic,
      token,
    });

    if (response.data.success) {
      console.log(`[Notifications] Unsubscribed from topic: ${topic}`);
      return true;
    } else {
      console.error('[Notifications] Failed to unsubscribe from topic:', response.data);
      return false;
    }
  } catch (error) {
    console.error(`[Notifications] Error unsubscribing from topic ${topic}:`, error);
    return false;
  }
};

/**
 * Request notification permission
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestPermission = async (): Promise<boolean> => {
  const permission = await requestNotificationPermission();
  return permission === 'granted';
};

/**
 * Check if notifications are enabled
 * @returns {boolean} True if notifications are enabled
 */
export const areNotificationsEnabled = (): boolean => {
  if (Platform.OS !== 'web') {
    return false;
  }

  if (!('Notification' in window)) {
    return false;
  }

  return Notification.permission === 'granted';
};

/**
 * Get current notification permission status
 * @returns {NotificationPermission} Permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (Platform.OS !== 'web') {
    return 'denied';
  }

  if (!('Notification' in window)) {
    return 'denied';
  }

  return Notification.permission;
};

/**
 * Clean up notification service
 * Call this when the user logs out
 */
export const cleanupNotifications = () => {
  // Unsubscribe from foreground messages
  if (foregroundUnsubscribe) {
    foregroundUnsubscribe();
    foregroundUnsubscribe = null;
  }

  // Clear handlers
  notificationHandlers = [];

  console.log('[Notifications] Cleaned up');
};

/**
 * Refresh FCM token
 * Call this periodically or when user logs in to ensure token is up to date
 * @returns {Promise<boolean>} True if successful
 */
export const refreshToken = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    return false;
  }

  try {
    const token = await getFCMToken();
    if (!token) {
      return false;
    }

    return await sendTokenToBackend(token);
  } catch (error) {
    console.error('[Notifications] Error refreshing token:', error);
    return false;
  }
};

export default {
  initializeNotifications,
  sendTokenToBackend,
  onNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  requestPermission,
  areNotificationsEnabled,
  getNotificationPermission,
  cleanupNotifications,
  refreshToken,
};
