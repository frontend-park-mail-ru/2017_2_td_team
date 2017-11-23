this.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/bundle.js',
                '/styles.css',
                '/img/textures/attackIcon.png',
                '/img/textures/aspeedIcon.png',
                '/img/textures/hpIcon.png',
                '/img/textures/moneyIcon.png',
                '/img/titleset.png',
                '/img/titleset.json',
                '/7daab5c03279911663a04626da53f397.woff',
                '/1316bd7dab0eccb7c1ae1f7ba5b243c3.woff',
                '/122068bcd0df5f7f97e2d82ed60d9c8b.woff',
                '/e4a79871d104b1e9bada243a05cc78ed.woff',
                '/ed92ab9e8761f7ef025dd0b5f198db35.woff',
                '/index.html'
            ]);
        })
    );
});

this.addEventListener('fetch', event => {
    console.log('fetch', event);
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request)
        );
    } else {
        fetch(event.request);
    }
});

