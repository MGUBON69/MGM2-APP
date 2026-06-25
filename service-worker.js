const CACHE_NAME = 'pwa-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
];

// ขั้นตอนติดตั้ง Service Worker และเก็บ Cache ไฟล์เริ่มต้น
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ขั้นตอนเรียกใช้งาน และดึงไฟล์จาก Cache เมื่อเปิดแอป (ทำให้โหลดเร็วขึ้นมาก)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});