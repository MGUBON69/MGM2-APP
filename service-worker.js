const CACHE_NAME = 'pwa-smart-app-v1';
// รายชื่อไฟล์ที่ต้องการให้ใช้งานแบบ Offline ได้
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
];

// 1. ขั้นตอนติดตั้ง Service Worker และบันทึกไฟล์ลง Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡️ SW: Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ขั้นตอนล้าง Cache เก่าเมื่อมีการอัปเดตเวอร์ชันแอป
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 SW: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. ดักจับการเรียกขอไฟล์ (Fetch) เพื่อดึงจาก Cache มาแสดงผลทันทีแม้ตอน Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ถ้าระบบเจอไฟล์ใน Cache ให้ส่งไฟล์นั้นไปเลย (โหลดเร็วมาก) 
      // แต่ถ้าไม่เจอ ให้ทำการไปดึงข้อมูลจาก Network ตามปกติค่ะ
      return cachedResponse || fetch(event.request);
    })
  );
});
