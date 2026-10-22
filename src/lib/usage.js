/* =========================================================
   usage.js — registro de uso LOCAL
   Guarda solo qué se toca y cuándo, en este navegador.
   NUNCA guarda: matrículas, nombres, correos, teléfonos,
   notas ni nada escrito en el formulario. No sale de aquí:
   no hay ninguna llamada a ningún servidor.
   Para verlo:  usage.ver()      Para borrarlo: usage.borrar()
   ========================================================= */

const CLAVE = "plafer.usage.v1";
const TOPE = 500; // eventos guardados como mucho

function leer() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch {
    return [];
  }
}

function escribir(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista.slice(-TOPE)));
  } catch {
    /* modo privado o sin espacio: se ignora */
  }
}

function anotar(que, detalle) {
  const lista = leer();
  lista.push({
    q: String(que),
    d: detalle ? String(detalle).slice(0, 60) : "",
    t: new Date().toISOString(),
    p: Math.round(window.innerWidth), // ancho de pantalla, para saber si es móvil
  });
  escribir(lista);
}

// Clics en cualquier elemento marcado con data-uso
document.addEventListener("click", (ev) => {
  const el = ev.target.closest?.("[data-uso]");
  if (el) anotar("clic", el.getAttribute("data-uso"));
});

// Qué secciones llegan a verse
if ("IntersectionObserver" in window) {
  const vistas = {};
  const obs = new IntersectionObserver(
    (filas) => {
      for (const fila of filas) {
        const id = fila.target.id;
        if (fila.isIntersecting && id && !vistas[id]) {
          vistas[id] = true;
          anotar("seccion", id);
        }
      }
    },
    { threshold: 0.4 }
  );
  // El contenido lo pinta React, así que esperamos a que exista.
  window.setTimeout(() => {
    document.querySelectorAll("main section[id]").forEach((s) => obs.observe(s));
  }, 400);
}

anotar("visita", document.title);

window.usage = {
  anotar,
  ver() {
    console.table(leer());
    return leer();
  },
  borrar() {
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      /* nada */
    }
    return "borrado";
  },
};

export { anotar };
