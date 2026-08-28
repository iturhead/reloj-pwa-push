# Reloj PWA

Progressive Web App que muestra la hora actual del sistema y se actualiza automáticamente cada segundo. Incluye service worker para funcionamiento offline y manifest.json para instalación en dispositivos móviles.

## Archivos
- `index.html` — estructura principal de la app.
- `style.css` — estilos visuales.
- `script.js` — actualiza el reloj cada segundo y registra el service worker.
- `sw.js` — service worker (cachea el app shell para uso offline).
- `manifest.json` — configuración de instalación (nombre, íconos, colores, orientación).
- `icons/icon-192.png`, `icons/icon-512.png` — íconos de la app.

## Cómo probarlo localmente
```
python3 -m http.server 8000
```
Abre http://localhost:8000 en el navegador. Para probar la instalación como PWA, sírvelo con HTTPS o en localhost (ambos son válidos para service workers).

## Publicar en GitHub Pages (opcional)
1. Sube estos archivos a un repositorio de GitHub.
2. Ve a Settings → Pages → selecciona la rama main y la carpeta raíz.
3. La PWA quedará disponible en `https://<usuario>.github.io/<repositorio>/`.
