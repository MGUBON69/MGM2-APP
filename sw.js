const CACHE_NAME = 'mg-ubon-m2-v2'; // เปลี่ยนเวอร์ชันเพื่อเคลียร์แคชเก่า

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icon2.png',          // อัปเดตให้ตรงกับไฟล์จริงบน GitHub แล้วค่ะ
  './MG_profile.png',    // อัปเดตให้ตรงกับไฟล์จริงบน GitHub แล้วค่ะ
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
];

// 1. Install Event: ล็อกคลังไฟล์ App Shell ลงเครื่องลูกค้า
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡️ SW: บันทึก App Shell ของ MG UBON ลงในแคชเรียบร้อยค่ะ');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.error('❌ SW: เกิดข้อผิดพลาดในการเก็บแคช:', err))
  );
  self.skipWaiting();
});

// 2. Activate Event: เคลียร์แคชเวอร์ชันเก่าออกอัตโนมัติเมื่อมีการเปลี่ยนแปลงโครงสร้างโค้ด
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

// 3. Fetch Event: ดึงข้อมูลจากแคชส่งให้ผู้ใช้ทันที (Cache First) ถ้าไม่มีอินเทอร์เน็ต
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        console.log('🌐 SW: อุปกรณ์อยู่ในสถานะ Offline และไม่พบข้อมูลในระบบแคชค่ะคุณชินอิจิ');
      });
    })
  );
});
