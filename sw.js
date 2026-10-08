// ============================================
// 🚀 MG M2 MOTORSPORT - SERVICE WORKER
// ============================================

const CACHE_NAME = 'mg-ubon-m2-v3.1.1'; // เปลี่ยนเวอร์ชันเมื่ออัปเดต

// 1. แคชเฉพาะไฟล์ในเครื่องเราเท่านั้น (ปลอดภัยชัวร์)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon2.png',
  './MG_profile.png'
];

// 2. Install Event: บันทึก App Shell ลงแคช
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('⚡️ SW: กำลังบันทึก App Shell ของ MG UBON ลงในแคช...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ SW: บันทึก App Shell เรียบร้อยค่ะ');
        return self.skipWaiting();
      })
      .catch(err => console.error('❌ SW: เกิดข้อผิดพลาดในการเก็บแคช:', err))
  );
});

// 3. Activate Event: ล้างแคชเวอร์ชันเก่าออก
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
    }).then(() => {
      console.log('✅ SW: Activate เรียบร้อยค่ะ');
      return self.clients.claim();
    })
  );
});

// 4. Fetch Event: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  // ข้าม non-GET requests
  if (event.request.method !== 'GET') return;
  
  // ข้าม non-HTTP requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ถ้า fetch สำเร็จ ให้เก็บลงแคชด้วย (Runtime Caching)
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // ถ้า offline ให้ดึงจากแคช
        console.log('🌐 SW: อุปกรณ์อยู่ในสถานะ Offline ค่ะคุณชินอิจิ');
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // ถ้าเป็นหน้าเว็บ ให้แสดง index.html จากแคช
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          
          // สำหรับ resources อื่นที่ไม่อยู่ในแคช
          return new Response('Offline - MG M2 Motorsport', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});
