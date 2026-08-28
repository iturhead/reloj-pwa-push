/**
 * sw.js
 * Service worker de la PWA de reloj.
 * Su función es cachear el "app shell" (HTML, CSS, JS e íconos) para que
 * la aplicación pueda cargar y funcionar aunque el dispositivo esté sin
 * conexión a internet.
 */

// Nombre y versión del cache. Al cambiar la versión, se fuerza la
// actualización de los archivos guardados en el dispositivo del usuario.
const NOMBRE_CACHE = "reloj-pwa-cache-v2";

// Lista de archivos que forman el "app shell" y que se guardarán
// en el cache durante la instalación del service worker.
const ARCHIVOS_APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

/**
 * Evento "install": se dispara cuando el navegador instala el service
 * worker por primera vez (o detecta una nueva versión). Aquí se guarda
 * el app shell en el cache.
 */
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(NOMBRE_CACHE)
      .then((cache) => cache.addAll(ARCHIVOS_APP_SHELL))
      .then(() => self.skipWaiting()) // activa la nueva versión de inmediato
  );
});

/**
 * Evento "activate": se dispara cuando el service worker se activa.
 * Aquí se eliminan los caches de versiones anteriores para no acumular
 * archivos obsoletos en el dispositivo del usuario.
 */
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombresCache) =>
        Promise.all(
          nombresCache
            .filter((nombre) => nombre !== NOMBRE_CACHE)
            .map((nombre) => caches.delete(nombre))
        )
      )
      .then(() => self.clients.claim()) // toma el control de las páginas abiertas
  );
});

/**
 * Evento "fetch": intercepta cada petición de red que hace la aplicación.
 * Estrategia "cache first, network fallback": primero busca la respuesta
 * en el cache; si no la encuentra, la pide a la red y la guarda para la
 * próxima vez que se necesite sin conexión.
 */
self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respuestaEnCache) => {
      if (respuestaEnCache) {
        return respuestaEnCache;
      }

      return fetch(evento.request)
        .then((respuestaRed) => {
          // Solo se cachean respuestas válidas de peticiones GET
          if (evento.request.method === "GET" && respuestaRed && respuestaRed.status === 200) {
            const copiaRespuesta = respuestaRed.clone();
            caches.open(NOMBRE_CACHE).then((cache) => cache.put(evento.request, copiaRespuesta));
          }
          return respuestaRed;
        })
        .catch(() => {
          // Si no hay red ni cache disponible, se devuelve el index como respaldo
          return caches.match("./index.html");
        });
    })
  );
});
