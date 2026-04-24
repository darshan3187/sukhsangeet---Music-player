const CACHE_NAME = 'sukh-sangeet-v1';
const RUNTIME_CACHE = 'sukh-sangeet-runtime';
const PLAYLIST_CACHE = 'sukh-sangeet-playlists';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo-sukhsangeet.webp',
  '/robots.txt',
  '/sitemap.xml'
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== PLAYLIST_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network first, with fallback to cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and external schemes
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Let the browser handle third-party images directly so CSP can apply the
  // normal img-src policy without the service worker re-fetching them.
  if (event.request.destination === 'image' && url.origin !== self.location.origin) {
    return;
  }

  // API calls - Network first, fallback to cache
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const cacheName = url.pathname.includes('playlists') ? PLAYLIST_CACHE : RUNTIME_CACHE;
            caches.open(cacheName).then((c) => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((response) => response || new Response('Offline - Data not available', { status: 503 }));
        })
    );
    return;
  }

  // Static assets - Cache first
  if (url.pathname.match(/\.(js|css|woff2|webp|png|jpg|svg|ico)$/i)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
        .catch(() => {
          if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
            return new Response('Asset not available offline', { status: 404 });
          }
          return new Response('', { status: 404 });
        })
    );
    return;
  }

  // HTML pages - Network first
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Default - Network first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Background Sync for offline playlist creation
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-playlists') {
    event.waitUntil(
      caches.open(PLAYLIST_CACHE)
        .then((cache) => {
          console.log('[Service Worker] Syncing playlists...');
          return cache.keys();
        })
    );
  }
});

// Push Notifications (optional)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const options = {
    badge: '/logo-sukhsangeet.webp',
    icon: '/logo-sukhsangeet.webp',
    ...data
  };
  event.waitUntil(
    self.registration.showNotification('Sukh Sangeet', options)
  );
});
