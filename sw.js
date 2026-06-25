const CACHE_NAME = 'mg-ubon-m2-v2'; // เปลี่ยนเวอร์ชันเพื่อเคลียร์แคชเก่า

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icon.png',          // อัปเดตให้ตรงกับไฟล์จริงบน GitHub แล้วค่ะ
  './MG_profile.png',    // อัปเดตให้ตรงกับไฟล์จริงบน GitHub แล้วค่ะ
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
];

// ... โค้ดส่วนที่เหลือด้านล่างปล่อยไว้เหมือนเดิมได้เลยค่ะ ...
