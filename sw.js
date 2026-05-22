const CACHE_NAME = 'ai-maze-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Установка воркера и кэширование
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Перехват сетевых запросов для автономной работы
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
