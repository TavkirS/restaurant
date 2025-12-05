// Service Worker for Bella Vista Restaurant PWA

const CACHE_NAME = 'bella-vista-v1.0.0';
const STATIC_CACHE = 'bella-vista-static-v1.0.0';
const DYNAMIC_CACHE = 'bella-vista-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/menu.html',
  '/checkout.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/cart.js',
  '/assets/js/menu.js',
  '/assets/js/checkout.js',
  '/config.js',
  '/menu.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for API calls
  if (url.pathname.includes('/api/') || url.pathname.includes('menu.json') || url.pathname.includes('config.js')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch and cache new requests
        return fetch(request)
          .then((response) => {
            // Only cache successful GET requests
            if (response.ok && request.method === 'GET') {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);

            // Return offline fallback for HTML pages
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }

            // Return a basic offline response for other requests
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for orders (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'order-sync') {
    event.waitUntil(syncPendingOrders());
  }
});

// Function to sync pending orders when connection is restored
async function syncPendingOrders() {
  try {
    // Get pending orders from IndexedDB or localStorage
    const pendingOrders = await getPendingOrders();

    if (pendingOrders.length > 0) {
      // Send orders to server
      for (const order of pendingOrders) {
        await sendOrderToServer(order);
      }

      // Clear pending orders
      await clearPendingOrders();

      // Notify user
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'ORDERS_SYNCED',
            message: `${pendingOrders.length} orders synced successfully`
          });
        });
      });
    }
  } catch (error) {
    console.error('Order sync failed:', error);
  }
}

// Placeholder functions for order sync (implement based on your needs)
async function getPendingOrders() {
  // Implement based on your storage mechanism
  return [];
}

async function sendOrderToServer(order) {
  // Implement API call to send order
  return fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
}

async function clearPendingOrders() {
  // Clear pending orders from storage
}

// Push notification support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/favicons/android-chrome-192x192.png',
      badge: '/assets/images/favicons/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'View Order'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Bella Vista Restaurant', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/menu.html')
    );
  } else {
    // Default action - open home page
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
