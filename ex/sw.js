const CACHE_NAME = 'currency-calc-v2.0.0';
const STATIC_CACHE_NAME = 'currency-calc-static-v2.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
    './',
    './index.html',
    './currency.html',
    './calculator.html',
    './history.html',
    './length.html',
    './speed.html',
    './area.html',
    './volume.html',
    './bmi.html',
    './alcohol.html',
    './alcohol-info.html',
    './settings.html',
    './style.css',
    './preferences.js',
    './register-sw.js',
    './landing.js',
    './settings.js',
    './calculator.js',
    './app.js',
    './history.js',
    './length.js',
    './speed.js',
    './area.js',
    './volume.js',
    './bmi.js',
    './alcohol.js',
    './alcohol-info.js',
    './placeholder.js',
    './eur.json',
    './manifest.json',
    './icon/euro-blue.png',
    './img/scrn.jpg',
    './translations/en.json',
    './translations/sk.json',
    './translations/sr.json'
];

function isStaticAssetRequest(url, request) {
    const isKnownAsset = STATIC_ASSETS.some(asset => {
        const assetUrl = new URL(asset, self.location.href);
        return assetUrl.pathname === url.pathname;
    });

    return url.origin === self.location.origin && (
        isKnownAsset
        || request.destination === 'style'
        || request.destination === 'script'
        || request.destination === 'document'
        || request.destination === 'image'
        || request.destination === 'manifest'
    );
}

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Install completed');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE_NAME && cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation completed');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Handle API requests (exchange rates) - network first
    if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('currency-api')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache successful responses
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Handle static assets - cache first
    if (isStaticAssetRequest(url, event.request)) {

        event.respondWith(
            caches.match(event.request, { ignoreSearch: true })
                .then(async response => {
                    if (response) {
                        return response;
                    }

                    try {
                        const networkResponse = await fetch(event.request);
                        // Don't cache if not successful
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();
                        caches.open(STATIC_CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                        return networkResponse;
                    } catch (error) {
                        if (event.request.destination === 'document') {
                            const fallbackDocument = await caches.match(url.pathname, { ignoreSearch: true })
                                || await caches.match('./index.html', { ignoreSearch: true });

                            if (fallbackDocument) {
                                return fallbackDocument;
                            }
                        }

                        return caches.match('./', { ignoreSearch: true });
                    }
                })
        );
        return;
    }

    // Cache Google Fonts with stale-while-revalidate
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.match(event.request).then(cached => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(STATIC_CACHE_NAME).then(cache => cache.put(event.request, copy));
                    }
                    return networkResponse;
                }).catch(() => cached);
                return cached || fetchPromise;
            })
        );
        return;
    }

    // Default - try network first, fallback to cache
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});