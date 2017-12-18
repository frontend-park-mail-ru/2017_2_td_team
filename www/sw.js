const CACHE_NAME = 'v1';

const RESOURCES_TO_CACHE = [
    '/bundle.js',
    '/styles.css',
    '/img/textures/attackIcon.png',
    '/img/textures/aspeedIcon.png',
    '/img/textures/hpIcon.png',
    '/img/textures/bluetower.png',
    '/img/textures/otower.png',
    '/img/textures/redtower.png',
    '/img/textures/timerIcon.png',
    '/img/textures/moneyIcon.png',
    '/img/tileset.png',
    '/img/tileset.json',
    '/7daab5c03279911663a04626da53f397.woff',
    '/1316bd7dab0eccb7c1ae1f7ba5b243c3.woff',
    '/122068bcd0df5f7f97e2d82ed60d9c8b.woff',
    '/e4a79871d104b1e9bada243a05cc78ed.woff',
    '/ed92ab9e8761f7ef025dd0b5f198db35.woff',
    '/index.html',
];

this.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(RESOURCES_TO_CACHE);
            })
    );
});

this.addEventListener('fetch', event => {

    event.respondWith(
        caches
            .match(event.request)
            .then(cachedResponse => {
                if (cachedResponse && !navigator.onLine) {
                    return cachedResponse;
                }
                const request = event.request.clone();
                return fetch(request)
                    .then(response => {
                            if (!response || response.status >= 300 || response.type !== 'basic') {
                                return response;
                            }
                            if (!cachedResponse && request.method == 'GET' ) {
                                const responseToCache = response.clone();
                                caches
                                    .open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, responseToCache));
                            }
                            return response;
                        }
                    ).catch(err => {
                        if (err instanceof Response) {
                            return Promise.reject(err.clone());
                        }
                        return Promise.reject(err);
                    });
            })
    );
});

