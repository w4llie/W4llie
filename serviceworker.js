const CACHE_NAME = "cinetrack-v1";

const arquivos = [
    "./",
    "./html/index.html",
    "./css/style.css",
    "./javascript/script.js",
    "./manifest.json",
    "./icons/logo-cinetrack-192.png",
    "./icons/logo-cinetrack-512.png"
];

self.addEventListener("install", (evento) => {
    evento.waitUntil(caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(arquivos);
            })
    );
});

self.addEventListener("fetch", (evento) => {
    evento.respondWith(caches.match(evento.request).then((resposta) => {
                return resposta || fetch(evento.request);
            })
    );
});