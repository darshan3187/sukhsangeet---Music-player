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

  if (event.request.method !== 'GET') {
    return;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  if (event.request.destination === 'image' && url.origin !== self.location.origin) {
    return;
  }

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
