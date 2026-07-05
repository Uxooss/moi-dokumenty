const CACHE_NAME = 'doc-vault-v27';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './pdf.min.js',
  './pdf.worker.min.js',
  './pdfthumb.js',
  './manifest.json',
];

/* Install — cache all core assets */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* Activate — clean old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch — cache-first for local assets, network-first for external (fonts) */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  /* Google Fonts — stale-while-revalidate */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          const fetching = fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetching;
        })
      )
    );
    return;
  }

  /* Local assets — cache-first */
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  /* Everything else — network only */
  event.respondWith(fetch(event.request));
});
