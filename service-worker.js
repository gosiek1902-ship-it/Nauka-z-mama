const CACHE_NAME = 'aleksander-app-shell-v10';
const APP_FILES = [
  './',
  './index.html',
  './styles.css',
  './src/subjects.js',
  './src/expanded-content.js',
  './src/app.js',
  './src/android-updates.js',
  './src/register-service-worker.js',
  './manifest.webmanifest',
  './assets/icons/favicon-32.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES.map((path) => new Request(path, { cache: 'reload' })))));
  // Keep the current page and all of its files on the same release.
  // The new worker takes over after existing application windows are closed.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith('aleksander-app-shell-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key)),
  )));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
      return await cache.match('./index.html') || fetch(request);
    }));
    return;
  }

  event.respondWith(caches.open(CACHE_NAME).then((cache) => cache.match(request)).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  })));
});
