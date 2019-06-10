// Update cache names any time any of the cached files change.
const CORE_CACHE_NAME = 'site-static-v1-1-4';
const DINAMIC_CACHE_NAME = 'site-dinamic-v1-1-4';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/css/variables.css',
    '/css/main.css',
    '/img/icons/icon-192x192.png',
    '/img/icons/icon-512x512.png',
    '/js/home.js'
];

self.addEventListener('install', evt => {
    // service worker can be killed by browser before all caching process has been done, so we use "waitUntil"
    evt.waitUntil(
        caches.open(CORE_CACHE_NAME).then( cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then( keys => {
            return Promise.all( keys
                .filter( key => key !== CORE_CACHE_NAME && key !== DINAMIC_CACHE_NAME )
                .map( key => caches.delete( key ) ) )
        })
    );
});

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match( evt.request ).then( cachedResource => {
            return cachedResource || fetch( evt.request ).then( fetchResponse => {
                return caches.open(DINAMIC_CACHE_NAME).then( cache => {
                    cache.put( evt.request.url, fetchResponse.clone() );
                    return fetchResponse;
                } );
            } );
        } ).catch( () => {
            return caches.match('/offline.html');
        } )
    );
});