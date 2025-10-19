// Firebase Cloud Messaging Service Worker
// This service worker handles background push notifications

// TODO: Replace these values with your actual Firebase configuration
// You can get these from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Storefront 360';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icon.png',
    badge: '/badge.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  // Handle different notification types
  const notificationData = event.notification.data;
  let urlToOpen = '/';

  if (notificationData) {
    // Route to different screens based on notification type
    switch (notificationData.type) {
      case 'order':
        urlToOpen = `/orders/${notificationData.orderId}`;
        break;
      case 'product':
        urlToOpen = `/products/${notificationData.productId}`;
        break;
      case 'sale':
        urlToOpen = `/sales/${notificationData.saleId}`;
        break;
      case 'inventory':
        urlToOpen = '/inventory';
        break;
      case 'alert':
        urlToOpen = '/alerts';
        break;
      default:
        urlToOpen = notificationData.url || '/';
    }
  }

  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            url: urlToOpen,
            data: notificationData,
          });
          return;
        }
      }

      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received:', event);

  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  try {
    const payload = event.data.json();
    console.log('Push payload:', payload);

    // Let Firebase messaging handle the notification
    // This is already handled by onBackgroundMessage
  } catch (error) {
    console.error('Error parsing push event data:', error);
  }
});

// Cache API responses for offline use
const CACHE_NAME = 'storefront360-api-cache-v1';
const API_CACHE_URLS = [
  '/api/products',
  '/api/categories',
  '/api/settings',
];

// Cache API responses
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return cache.match(event.request);
          });
      })
    );
  }
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('storefront360-')) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

console.log('[firebase-messaging-sw.js] Service Worker loaded');
