// Меняем версию кэша на v2. Это сигнал для телефона, что пора обновиться!
const CACHE_NAME = 'ai-maze-liquid-v3';
const ASSETS = [
  './',
  'index.html',
  'manifest.json'
];

// Установка: заставляем новый воркер активироваться немедленно
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация: находим старый кэш (v1) и безжалостно его удаляем
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Удален старый кэш PWA:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Перехватываем управление сайтом сразу
  );
});

// Запрос ресурсов
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
