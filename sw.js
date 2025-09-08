self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('rajasthan-gk-quiz-cache').then(cache => {
            return cache.addAll([
                '/rajasthan-gk-quiz/index.html',
                '/rajasthan-gk-quiz/',
                'https://via.placeholder.com/200x200?text=Offline',
                'https://via.placeholder.com/200x200?text=Error',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/rajasthan-gk-quiz/index.html');
            });
        })
    );
});
