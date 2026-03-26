const CACHE_NAME = 'nubevault-v3';
const ASSETS = [
  'NubeVault.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap'
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS.filter(a => !a.startsWith('http'))))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('NubeVault.html'));
    })
  );
});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Registro: Hashear contraseña antes de guardar
async function registrarUsuario(password) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    // Guardar 'hash' en la base de datos
}

// 2. Login: Verificar y emitir JWT
async function login(userAttempt, storedHash) {
    const match = await bcrypt.compare(userAttempt, storedHash);
    if (match) {
        // Crear Token (expira en 2 horas)
        return jwt.sign({ userId: 123 }, 'TU_CLAVE_SECRETA', { expiresIn: '2h' });
    }
}