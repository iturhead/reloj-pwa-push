# Reloj PWA

Progressive Web App que muestra la hora actual del sistema y se actualiza automáticamente cada segundo. Incluye service worker para funcionamiento offline y manifest.json para instalación en dispositivos móviles.

## Archivos
- `index.html` — estructura principal de la app.
- `style.css` — estilos visuales.
- `script.js` — actualiza el reloj cada segundo y registra el service worker.
- `sw.js` — service worker (cachea el app shell para uso offline).
- `manifest.json` — configuración de instalación (nombre, íconos, colores, orientación).
- `icons/icon-192.png`, `icons/icon-512.png` — íconos de la app.

## Aplicación en ejecución
https://iturhead.github.io/reloj-pwa-push/
