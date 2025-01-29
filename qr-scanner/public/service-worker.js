const CACHE_NAME = 'qr-scanner-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    'icons/ikona.png',	
    '/manifest.json',
    '/js/qr-scanner.umd.min.js',
    '/js/qr-scanner-worker.min.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request)
                    .then(response => {
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, response.clone());
                                return response;
                            });
                    });
            })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-scanned-codes') {
        event.waitUntil(
            syncScannedCodes()
        );
    }
});

self.addEventListener('push', event => {
    const options = {
        body: event.data.text()
    };

    event.waitUntil(
        self.registration.showNotification('QR Skener', options)
    );
});

async function syncScannedCodes() {
    self.registration.showNotification('QR Skener', {
        body: 'Skenovi su uspješno sinkronizirani!'
    });
}