const CACHE_NAME = 'mg-ubon-m2-v3.1.1'; // เปลี่ยนเวอร์ชัน

// 1. แคชเฉพาะไฟล์ในเครื่องเราเท่านั้น (ปลอดภัยชัวร์)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon2.png' // เช็คให้ชัวร์ว่ามีไฟล์นี้อยู่จริง
  './MG_profile.png' // เช็คให้ชัวร์ว่ามีไฟล์นี้อยู่จริง
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡️ SW: บันทึก App Shell ของ MG UBON ลงในแคชเรียบร้อยค่ะ');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.error('❌ SW: เกิดข้อผิดพลาดในการเก็บแคช:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 SW: ล้างแคชเวอร์ชันเก่าออกเรียบร้อยค่ะ:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: แบบ Network First, fallback to Cache สำหรับลิงก์ภายนอก
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // ถ้ามีในแคช ให้ใช้แคช
      }
      
      // ถ้าไม่มีในแคช ให้ดึงจากเน็ต แล้วเอามาเก็บลงแคชด้วย (Runtime Caching)
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // เก็บลงแคชเฉพาะ HTTP Status 200 เพื่อป้องกันแคชไฟล์ที่พัง
          if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        console.log('🌐 SW: อุปกรณ์อยู่ในสถานะ Offline ค่ะคุณชินอิจิ');
      });
    })
  );
});
