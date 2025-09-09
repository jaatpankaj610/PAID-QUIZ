self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/PAID-QUIZ/free-quiz.html',
                '/PAID-QUIZ/index.html',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/freequestions.json')) {
        return fetch(event.request); // JSON को कैश न करे, सीधा फेच करे
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
