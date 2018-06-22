/** Page installs as an application **/
/** Every time you load a page, page is put into the cache **/
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('assets').then(function(cache) {
			return cache.addAll(
				[
					'/',
					'/css/responsive.css',
					'/css/styles.css',
					'/data/restaurants.json',
					'/js/dbhelper.js',
					'/js/main.js',
					'/js/restaurant_info.js',
					'/index.html',
					'/restaurant.html'
				]
			);
		})
	);

});

/** Gets triggered every time you get a resource with your browser **/
/** If it's an image: see if image is in the cache and if not, put it in the cache then return it **/
/** Check if the request fails for all files, then return from the cache, if succeeds, don't do anything **/
self.addEventListener('fetch', function(event) {
	const request = event.request;
	if (request.url.includes('img')) {
		event.respondWith(
			caches.open('assets').then(function(cache) {
				return cache.match(event.request).then(function (cachedImage) {
					return cachedImage || fetch(event.request).then(function(response) {
						cache.put(event.request, response.clone());
						return response;
					});
				});
			})
		);
	} else {
		event.respondWith(
			fetch(request).catch(function(error) {
				return caches.open('assets').then(function(cache) {
					return cache.match(request);
				});
			})
		);
	}

});