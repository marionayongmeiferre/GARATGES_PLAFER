// Textos y maquetación de los correos y de la página de decidir.
// Todo en un sitio para poder cambiar el tono sin tocar la lógica.

const MARCA = "#1A47C2";
const TINTA = "#141414";
const HUMO  = "#5E5E5E";
const LINEA = "#E3E2DD";

// Escapar lo que escribe el cliente antes de meterlo en HTML.
// Si no, alguien podría colar etiquetas en el correo que nos llega.
export function limpiar(txt) {
  return String(txt ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function fecha(iso) {
  if (!iso) return "—";
  const [a, m, d] = String(iso).slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

export function dias(entrada, salida) {
  const a = new Date(entrada);
  const b = new Date(salida);
  const n = Math.round((b - a) / 86400000);
  return n === 1 ? "1 día" : `${n} días`;
}

export function euros(n) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

// ─── Trozos de maquetación ──────────────────────────────────────────────
function envoltorio(contenido) {
  return `<!doctype html>
<html lang="es"><body style="margin:0;padding:24px;background:#F7F7F5;
  font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${TINTA};line-height:1.6">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid ${LINEA};padding:32px">
    ${contenido}
    <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid ${LINEA};
      font-size:12px;color:${HUMO}">
      Plafer Parking · Garatges Plafer S.L.U.<br>
      C. de Mallorca, 219–221 · C. de Sant Pere d'Abanto, 14 · Barcelona
    </p>
  </div>
</body></html>`;
}

function tabla(r) {
  const fila = (k, v) =>
    `<tr>
      <td style="padding:7px 0;color:${HUMO};font-size:14px;width:38%">${k}</td>
      <td style="padding:7px 0;font-size:14px;font-weight:600">${v}</td>
    </tr>`;

  return `<table style="width:100%;border-collapse:collapse;margin:20px 0">
    ${fila("Referencia", limpiar(r.referencia))}
    ${fila("Aparcamiento", limpiar(r.garaje))}
    ${fila("Entrada", fecha(r.entrada))}
    ${fila("Salida", fecha(r.salida))}
    ${fila("Duración", dias(r.entrada, r.salida))}
    ${fila("Matrícula", limpiar(r.matricula))}
    ${r.vehiculo ? fila("Vehículo", limpiar(r.vehiculo)) : ""}
  </table>`;
}

// ─── 1. Al cliente, nada más pedirla ────────────────────────────────────
export function correoClienteRecibida(r) {
  return envoltorio(`
    <h1 style="margin:0;font-size:22px;line-height:1.3">Hemos recibido tu solicitud</h1>
    <p style="margin:16px 0 0;font-size:15px">
      Hola ${limpiar(r.nombre)}. Tenemos tu petición de plaza y la estamos mirando.
      Te escribiremos a este mismo correo con el precio y con la confirmación.
    </p>
    <p style="margin:16px 0 0;font-size:15px;color:${HUMO}">
      Todavía <strong style="color:${TINTA}">no es una reserva en firme</strong>: lo será
      cuando te respondamos diciendo que sí.
    </p>
    ${tabla(r)}
    ${r.notas ? `<p style="margin:0;font-size:14px;color:${HUMO}">
      <strong style="color:${TINTA}">Nos has dicho:</strong><br>${limpiar(r.notas)}</p>` : ""}
    <p style="margin:24px 0 0;font-size:14px;color:${HUMO}">
      Si algo no cuadra, responde a este correo o llámanos al 934 53 53 84.
    </p>
  `);
}

// ─── 2. A Plafer, con el enlace para decidir ────────────────────────────
export function correoPlaferNueva(r, enlace) {
  return envoltorio(`
    <h1 style="margin:0;font-size:22px;line-height:1.3">Nueva prereserva</h1>
    <p style="margin:16px 0 0;font-size:15px">
      ${limpiar(r.nombre)} pide plaza en ${limpiar(r.garaje)}.
    </p>
    ${tabla(r)}
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
      <tr><td style="padding:7px 0;color:${HUMO};font-size:14px;width:38%">Teléfono</td>
          <td style="padding:7px 0;font-size:14px;font-weight:600">${limpiar(r.telefono)}</td></tr>
      <tr><td style="padding:7px 0;color:${HUMO};font-size:14px">Correo</td>
          <td style="padding:7px 0;font-size:14px;font-weight:600">${limpiar(r.email)}</td></tr>
    </table>
    ${r.notas ? `<p style="margin:0 0 20px;font-size:14px;color:${HUMO}">
      <strong style="color:${TINTA}">Observaciones:</strong><br>${limpiar(r.notas)}</p>` : ""}
    <a href="${enlace}" style="display:inline-block;background:${MARCA};color:#fff;
      text-decoration:none;padding:14px 24px;font-size:15px;font-weight:600">
      Aceptar o rechazar
    </a>
    <p style="margin:16px 0 0;font-size:13px;color:${HUMO}">
      Ese enlace lleva a una página donde pones el precio y le respondes.
      No lo reenvíes: quien lo tenga puede decidir sobre esta reserva.
    </p>
  `);
}

// ─── 3. Al cliente, con la respuesta ────────────────────────────────────
export function correoClienteAceptada(r) {
  return envoltorio(`
    <h1 style="margin:0;font-size:22px;line-height:1.3">Tu plaza está confirmada</h1>
    <p style="margin:16px 0 0;font-size:15px">
      Hola ${limpiar(r.nombre)}. Tenemos sitio para esas fechas. Te esperamos.
    </p>
    ${tabla(r)}
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
      <tr>
        <td style="padding:14px 0;border-top:2px solid ${TINTA};font-size:16px;font-weight:700">Precio</td>
        <td style="padding:14px 0;border-top:2px solid ${TINTA};font-size:20px;font-weight:700;
          text-align:right;color:${MARCA}">${euros(r.precio)}</td>
      </tr>
    </table>
    ${r.mensaje ? `<p style="margin:0 0 20px;font-size:15px">${limpiar(r.mensaje).replace(/\n/g, "<br>")}</p>` : ""}
    <p style="margin:0;font-size:14px;color:${HUMO}">
      Se paga en el garaje, no por internet. Guarda tu referencia
      <strong style="color:${TINTA}">${limpiar(r.referencia)}</strong> y dila al llegar.
      Si no puedes venir, avísanos.
    </p>
  `);
}

export function correoClienteRechazada(r) {
  return envoltorio(`
    <h1 style="margin:0;font-size:22px;line-height:1.3">No podemos darte plaza</h1>
    <p style="margin:16px 0 0;font-size:15px">
      Hola ${limpiar(r.nombre)}. Lo sentimos: para esas fechas no tenemos sitio.
    </p>
    ${r.mensaje ? `<p style="margin:16px 0 0;font-size:15px">${limpiar(r.mensaje).replace(/\n/g, "<br>")}</p>` : ""}
    ${tabla(r)}
    <p style="margin:0;font-size:14px;color:${HUMO}">
      Si te sirven otras fechas, escríbenos y lo miramos. También puedes venir sin
      reservar y pagar por minutos, mientras quede hueco.
    </p>
  `);
}
