// Storefront 360 Service Worker
// Handles offline-first caching strategy for PWA functionality

const CACHE_VERSION = 'v1';
const CACHE_NAME = `storefront360-${CACHE_VERSION}`;
const API_CACHE_NAME = `storefront360-api-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `storefront360-images-${CACHE_VERSION}`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon.png',
  '/offline.html', // Create this for offline fallback
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/categories',
  '/api/settings',
  '/api/user/profile',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS.filter((url) => {
        // Only cache assets that exist
        return fetch(url, { method: 'HEAD' })
          .then(() => true)
          .catch(() => {
            console.warn(`[Service Worker] Failed to cache: ${url}`);
            return false;
          });
      }));
    }).catch((error) => {
      console.error('[Service Worker] Failed to cache static assets:', error);
    })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (
            cacheName.startsWith('storefront360-') &&
            cacheName !== CACHE_NAME &&
            cacheName !== API_CACHE_NAME &&
            cacheName !== IMAGE_CACHE_NAME
          ) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME));
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE_NAME));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request));
    return;
  }

  // Handle other static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});

/**
 * Network-first strategy
 * Try network first, fall back to cache if offline
 * Ideal for API requests where fresh data is important
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network request failed, trying cache:', request.url);

    // Try to get from cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response if no cache
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'You are currently offline. Please check your connection.',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 * Ideal for static assets that don't change often
 */
async function cacheFirstStrategy(request, cacheName) {
  // Try to get from cache first
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // If not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Failed to fetch:', request.url, error);

    // Return a generic offline response for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }

    return new Response('Network error', {
      status: 408,
      statusText: 'Network error',
    });
  }
}

/**
 * Navigation strategy for HTML page requests
 * Network-first with cache fallback and offline page
 */
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache the page
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Navigation request failed, trying cache');

    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Show offline page
    return caches.match('/offline.html') || caches.match('/index.html');
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('storefront360-')) {
              console.log('[Service Worker] Clearing cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

/**
 * Sync offline data when connection is restored
 */
async function syncData() {
  console.log('[Service Worker] Syncing offline data...');

  try {
    // Get pending requests from IndexedDB or cache
    // This is a placeholder - implement based on your app's needs
    const pendingRequests = await getPendingRequests();

    // Send pending requests
    const results = await Promise.allSettled(
      pendingRequests.map((request) => fetch(request))
    );

    // Notify clients about sync results
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        results: results,
      });
    });

    console.log('[Service Worker] Sync complete');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

/**
 * Get pending requests that need to be synced
 * Implement this based on your app's offline storage strategy
 */
async function getPendingRequests() {
  // TODO: Implement offline request queue using IndexedDB
  // For now, return empty array
  return [];
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');

  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();
    const title = data.notification?.title || 'Storefront 360';
    const options = {
      body: data.notification?.body || 'You have a new notification',
      icon: '/icon.png',
      badge: '/badge.png',
      data: data.data,
      vibrate: [200, 100, 200],
      tag: data.tag || 'default',
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('[Service Worker] Error handling push notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window if no existing window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

console.log('[Service Worker] Loaded successfully');
