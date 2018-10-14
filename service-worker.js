const CACHE_NAME = 'gotch-wars-cache';
const offlineURL = '/';
const installFilesEssential = [
  '/',
  '/manifest.json',
  '/app-icon192x192.png',
].concat(offlineURL);
const installFilesDesirable = [
  '/favicon.ico',
  '/fetchUsers',
]

function installStaticFiles() {
  return caches.open(CACHE_NAME).then(cache => {
    console.info('[ServiceWorker] Cache Opened');
    // cache desirable files
    cache.addAll(installFilesDesirable);
    // cache essential files
    return cache.addAll(installFilesEssential);
  });
}

function clearOldCache() {
  return caches.keys().then(keylist => {
    return Promise.all(
      keylist
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );
  });
}

self.addEventListener('install', event => {
  console.debug('[ServiceWorker] [Install]');
  event.waitUntil(
    installStaticFiles()
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.debug(`[ServiceWorker] [Activate]`);

  event.waitUntil(
    clearOldCache()
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  console.debug(`[ServiceWorker] [Fetch] ${req.method}: ${req.url}`);
  event.respondWith(
    caches.match(event.request)
      .then(resp => {
        if (resp) {
          console.info('[ServiceWorker] Return from cache', resp);
          return resp;
        }
        return fetch(event.request);
      })
  );
});
