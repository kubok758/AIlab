const CACHE_NAME = 'ai-maze-liquid-v15'; // Повысили версию до v15 для жесткого сброса старой памяти на смартфонах
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'win.mp3'
];

// Установка: скачиваем и кэшируем все ресурсы для автономной работы
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Активация: находим и полностью удаляем все старые версии кэша (v14, v13 и т.д.)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Удален устаревший кэш PWA:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Мгновенно активируем воркер во всех открытых вкладках
  );
});

// Перехват запросов: обеспечиваем моментальный оффлайн-запуск приложения
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
