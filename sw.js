const CACHE_NAME = 'ai-maze-liquid-v14'; // Повысили версию до v14 для сброса старой памяти
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'win.mp3' // Добавили аудиофайл в кэш для полной автономности
];

// Установка: скачиваем обновлённые ресурсы
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Активация: вычищаем абсолютно все предыдущие версии кэша из памяти смартфона
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
    }).then(() => self.clients.claim()) // Мгновенно берём под контроль открытые вкладки
  );
});

// Перехват запросов: обеспечиваем моментальный запуск приложения в offline-режиме
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
