const CACHE_NAME = 'ai-maze-liquid-v12'; // Новая версия кэша для сброса старой памяти на смартфонах
const ASSETS = [
  './',
  'index.html',
  'manifest.json'
];

// Установка: скачиваем новые файлы и заставляем воркер активироваться немедленно
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Активация: находим старые версии кэша (v11, v2, v1) и безжалостно их удаляем
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
    }).then(() => self.clients.claim()) // Немедленно берём управление приложением в свои руки
  );
});

// Перехват запросов: отдаем файлы из свежего кэша для мгновенной работы без интернета
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
