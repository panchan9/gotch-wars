const CACHE_NAME = 'gotch-wars-cache';
const offlineURL = '/';
const installFiles = [
  '/',
  '/index.html',
  '/?utm_source=homescreen',
  '/manifest.json',
  '/app-icon192x192.png',
  '/favicon.ico',
];

function installStaticFiles() {
  return caches.open(CACHE_NAME).then(cache => {
    console.info('[ServiceWorker] Cache Opened');
    // cache essential files
    return cache.addAll(installFiles);
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
  console.debug('[ServiceWorker] [INSTALL]');
  event.waitUntil(
    installStaticFiles()
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.debug(`[ServiceWorker] [ACTIVATE]`);

  event.waitUntil(
    clearOldCache()
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  console.debug(`[ServiceWorker] [FETCH] ${req.method}: ${url.href}`);
  event.respondWith(
    caches.match(event.request).then(resp => {
      if (resp) {
        console.info('[ServiceWorker] [FETCH] Cache used', resp);
        return resp;
      }
      if (/^(app|vendor)\.[a-z0-9]+\.bundle\.js$/.test(url.pathname)) {
        return fetch(req).then(resp => {
          console.info(`[ServiceWorker] [FETCH] Add Cache`, url.pathname);
          caches.open(CACHE_NAME)
            .then(cache => cache.add(url.pathname));

          return resp;
        });
      }
      return fetch(req);
    })
  );
});
