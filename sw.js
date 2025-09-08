self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('rajasthan-gk-quiz-cache-v2').then(cache => {
            return cache.addAll([
                '/rajasthan-gk-quiz/index.html',
                '/rajasthan-gk-quiz/',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'
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
