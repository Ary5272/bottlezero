const CACHE_NAME = 'bottlezero-v3'
const STATIC_ASSETS = ['/', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('overpass-api.de')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) =>
          cached || fetch(request).then((resp) => {
            if (resp.ok) cache.put(request, resp.clone())
            return resp
          })
        )
      )
    )
    return
  }

  if (url.origin === self.location.origin) {
    event.respondWith(fetch(request).catch(() => caches.match(request)))
  }
})
