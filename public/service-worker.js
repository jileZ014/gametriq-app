
// Cache names
const CACHE_NAME = 'gametriq-cache-v1';
const API_CACHE_NAME = 'gametriq-api-cache-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
  // Add other static assets here
];

// Install event: Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME, API_CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Serve from cache or network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' ||
      !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // API request strategy: Network first, then cache
  if (url.pathname.includes('/rest/v1') || url.pathname.includes('/auth/v1')) {
    event.respondWith(
      networkFirstStrategy(event.request)
    );
    return;
  }

  // Static assets strategy: Cache first, then network
  event.respondWith(
    cacheFirstStrategy(event.request)
  );
});

// Network-first strategy: Try network, fall back to cache
async function networkFirstStrategy(request) {
  try {
    // Try to fetch from network
    const networkResponse = await fetch(request);
    
    // If successful, clone and store in cache
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    console.log('Network request failed, falling back to cache', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cached response, show offline fallback
    throw error;
  }
}

// Cache-first strategy: Try cache, fall back to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200 && 
        (request.url.endsWith('.js') || 
         request.url.endsWith('.css') || 
         request.url.endsWith('.png') ||
         request.url.endsWith('.jpg') ||
         request.url.endsWith('.svg') ||
         request.url.endsWith('.ico'))) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback offline page (if you have one)
    console.error('Fetch failed:', error);
    
    // For HTML requests, show an offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Background sync for offline stats
self.addEventListener('sync', event => {
  if (event.tag === 'sync-stats') {
    event.waitUntil(syncOfflineStats());
  }
});

// Function to sync offline stats
async function syncOfflineStats() {
  try {
    // Try to get the client to handle the sync
    const client = await self.clients.get(self.clients.matchAll());
    if (client) {
      client.postMessage({
        type: 'SYNC_OFFLINE_STATS'
      });
    }
    return true;
  } catch (error) {
    console.error('Background sync failed:', error);
    return false;
  }
}
