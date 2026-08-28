/**
 * script.js
 * Lógica principal de la PWA de reloj:
 * 1) Actualiza la hora y la fecha mostradas en pantalla cada segundo.
 * 2) Registra el service worker para habilitar el funcionamiento offline
 *    y la instalación de la aplicación en dispositivos móviles.
 */

// Referencias a los elementos del DOM que se van a actualizar
const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const statusElement = document.getElementById("status");
const statusTextElement = document.getElementById("status-text");

// Nombres de los días y meses en español para formatear la fecha
const NOMBRES_DIAS = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];
const NOMBRES_MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * Agrega un cero a la izquierda si el número es menor a 10.
 * Ejemplo: 5 -> "05"
 * @param {number} numero
 * @returns {string}
 */
function dosDigitos(numero) {
  return String(numero).padStart(2, "0");
}

/**
 * Construye el texto de la hora actual en formato HH:MM:SS.
 * @param {Date} fecha
 * @returns {string}
 */
function formatearHora(fecha) {
  const horas = dosDigitos(fecha.getHours());
  const minutos = dosDigitos(fecha.getMinutes());
  const segundos = dosDigitos(fecha.getSeconds());
  return `${horas}:${minutos}:${segundos}`;
}

/**
 * Construye el texto de la fecha actual, por ejemplo:
 * "domingo, 16 de agosto de 2026".
 * @param {Date} fecha
 * @returns {string}
 */
function formatearFecha(fecha) {
  const nombreDia = NOMBRES_DIAS[fecha.getDay()];
  const nombreMes = NOMBRES_MESES[fecha.getMonth()];
  return `${nombreDia}, ${fecha.getDate()} de ${nombreMes} de ${fecha.getFullYear()}`;
}

/**
 * Lee la hora actual del sistema y actualiza el contenido de
 * los elementos #clock y #date en el documento.
 */
function actualizarReloj() {
  const ahora = new Date();
  clockElement.textContent = formatearHora(ahora);
  dateElement.textContent = formatearFecha(ahora);
}

// Primer pintado inmediato (para no esperar un segundo al cargar la página)
actualizarReloj();

// A partir de aquí, se actualiza automáticamente cada 1000 ms (1 segundo)
setInterval(actualizarReloj, 1000);

/**
 * Actualiza la insignia de estado según la conexión y el registro
 * del service worker, solo con fines informativos para el usuario.
 * @param {string} texto
 * @param {"ready"|"offline"|""} clase
 */
function actualizarEstado(texto, clase) {
  statusTextElement.textContent = texto;
  statusElement.className = "status-badge" + (clase ? " " + clase : "");
}

window.addEventListener("online", () => actualizarEstado("Conectado", "ready"));
window.addEventListener("offline", () => actualizarEstado("Sin conexión (modo offline)", "offline"));

/**
 * Registra el service worker (sw.js) para permitir que la aplicación
 * funcione sin conexión y pueda instalarse como PWA.
 */
function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    actualizarEstado("Service worker no soportado", "offline");
    return;
  }

  navigator.serviceWorker
    .register("sw.js")
    .then((registro) => {
      console.log("Service worker registrado con éxito:", registro.scope);
      actualizarEstado(navigator.onLine ? "Conectado" : "Sin conexión (modo offline)", navigator.onLine ? "ready" : "offline");
    })
    .catch((error) => {
      console.error("Error al registrar el service worker:", error);
      actualizarEstado("Error al registrar service worker", "offline");
    });
}

window.addEventListener("load", registrarServiceWorker);
