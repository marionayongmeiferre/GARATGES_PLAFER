import { db, tokenIgual } from "./_lib/db.js";
import { enviarCorreo } from "./_lib/correo.js";
import {
  correoClienteAceptada, correoClienteRechazada,
  limpiar, fecha, dias, euros,
} from "./_lib/plantillas.js";

// =========================================================================
// La página donde Plafer acepta o rechaza una prereserva.
// No hay usuario ni contraseña: manda el enlace secreto del correo.
// Quien tiene acceso a ese buzón, decide. Es lo que se pidió.
// =========================================================================

const ESTILO = `
  *{box-sizing:border-box}
  body{margin:0;padding:24px;background:#F7F7F5;color:#141414;line-height:1.6;
    font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}
  .caja{max-width:560px;margin:0 auto;background:#fff;border:1px solid #E3E2DD;padding:32px}
  h1{margin:0 0 8px;font-size:23px;line-height:1.25}
  p{margin:0 0 14px;font-size:15px}
  .apagado{color:#5E5E5E}
  table{width:100%;border-collapse:collapse;margin:20px 0}
  td{padding:7px 0;font-size:14px}
  td.k{color:#5E5E5E;width:38%}
  td.v{font-weight:600}
  label{display:block;margin:18px 0 6px;font-size:15px;font-weight:600}
  input,textarea{width:100%;padding:12px;font:inherit;font-size:16px;
    border:1px solid #C9C7C0;background:#F7F7F5;border-radius:0}
  input:focus,textarea:focus{background:#fff;outline:2px solid #1A47C2;outline-offset:2px}
  .botones{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}
  button{font:inherit;font-size:16px;font-weight:600;padding:14px 24px;border:2px solid;cursor:pointer}
  .si{background:#15803D;border-color:#15803D;color:#fff}
  .no{background:#fff;border-color:#B3261E;color:#B3261E}
  .error{border-left:4px solid #B3261E;background:#FBE9E7;padding:12px 16px;margin:0 0 18px;font-size:15px}
  .sello{display:inline-block;padding:6px 14px;font-size:14px;font-weight:700;color:#fff}
`;

function pagina(titulo, contenido, codigo = 200, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return res.status(codigo).send(
    `<!doctype html><html lang="es"><head><meta charset="utf-8">
     <meta name="viewport" content="width=device-width,initial-scale=1">
     <meta name="robots" content="noindex,nofollow">
     <title>${titulo} · Plafer</title><style>${ESTILO}</style></head>
     <body><div class="caja">${contenido}</div></body></html>`
  );
}

function resumen(r) {
  const f = (k, v) => `<tr><td class="k">${k}</td><td class="v">${v}</td></tr>`;
  return `<table>
    ${f("Referencia", limpiar(r.referencia))}
    ${f("Aparcamiento", limpiar(r.garaje))}
    ${f("Entrada", fecha(r.entrada))}
    ${f("Salida", fecha(r.salida))}
    ${f("Duración", dias(r.entrada, r.salida))}
    ${f("Matrícula", limpiar(r.matricula))}
    ${r.vehiculo ? f("Vehículo", limpiar(r.vehiculo)) : ""}
    ${f("Nombre", limpiar(r.nombre))}
    ${f("Teléfono", `<a href="tel:${limpiar(r.telefono)}">${limpiar(r.telefono)}</a>`)}
    ${f("Correo", `<a href="mailto:${limpiar(r.email)}">${limpiar(r.email)}</a>`)}
    ${r.notas ? f("Observaciones", limpiar(r.notas)) : ""}
  </table>`;
}

function formulario(r, aviso = "") {
  return `
    <h1>Prereserva ${limpiar(r.referencia)}</h1>
    <p class="apagado">Mira los datos y responde. Lo que pongas aquí es lo que
      le llegará por correo a ${limpiar(r.nombre)}.</p>
    ${resumen(r)}
    ${aviso ? `<p class="error">${aviso}</p>` : ""}
    <form method="POST" action="/api/decidir">
      <input type="hidden" name="ref" value="${limpiar(r.referencia)}">
      <input type="hidden" name="t" value="${limpiar(r.token)}">

      <label for="precio">Precio para toda la estancia, en euros</label>
      <input id="precio" name="precio" type="text" inputmode="decimal" placeholder="99,23">
      <p class="apagado" style="font-size:14px;margin-top:6px">
        Solo hace falta si aceptas. Con el 10 % de descuento ya aplicado.
      </p>

      <label for="mensaje">Dos líneas para el cliente (opcional)</label>
      <textarea id="mensaje" name="mensaje" rows="3"
        placeholder="Entra por Mallorca 219. Al llegar di tu referencia en la cabina."></textarea>

      <div class="botones">
        <button class="si" type="submit" name="accion" value="aceptar">Aceptar la reserva</button>
        <button class="no" type="submit" name="accion" value="rechazar">Rechazarla</button>
      </div>
    </form>`;
}

function yaDecidida(r) {
  const aceptada = r.estado === "aceptada";
  return `
    <h1>Esta prereserva ya está resuelta</h1>
    <p><span class="sello" style="background:${aceptada ? "#15803D" : "#B3261E"}">
      ${aceptada ? "ACEPTADA" : "RECHAZADA"}</span></p>
    <p class="apagado">Se decidió el ${fecha(r.decidida_at)} y ya se avisó
      a ${limpiar(r.nombre)}. Abrir este enlace otra vez no manda un segundo correo.</p>
    ${aceptada ? `<p><strong>Precio enviado: ${euros(r.precio)}</strong></p>` : ""}
    ${resumen(r)}
    <p class="apagado" style="font-size:14px">Para cambiar algo, escribe directamente
      a ${limpiar(r.email)}.</p>`;
}

// ─── Leer el número que escriba la persona: 99,23 o 99.23 ───────────────
function aNumero(txt) {
  const limpio = String(txt ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
}

async function buscar(ref, token) {
  const { data, error } = await db()
    .from("prereservas")
    .select("*")
    .eq("referencia", String(ref ?? "").trim().toUpperCase())
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  if (!tokenIgual(data.token, String(token ?? ""))) return null;
  return data;
}

export default async function handler(req, res) {
  const entrada = req.method === "POST" ? (req.body || {}) : (req.query || {});
  const { ref, t } = entrada;

  let r;
  try {
    r = await buscar(ref, t);
  } catch (e) {
    console.error("[decidir] Error al buscar:", e.message);
    return pagina("Error", `<h1>Algo ha fallado</h1>
      <p>No hemos podido leer la prereserva. Vuelve a intentarlo en un momento.</p>`, 500, res);
  }

  // Mismo mensaje para "no existe" y "token incorrecto": así no se puede
  // averiguar qué referencias existen probando.
  if (!r) {
    return pagina("No encontrada", `<h1>Este enlace no vale</h1>
      <p>O está mal copiado, o la prereserva ya no existe. Busca el correo original.</p>`, 404, res);
  }

  if (req.method === "GET") {
    if (r.estado !== "pendiente") return pagina("Ya resuelta", yaDecidida(r), 200, res);
    return pagina(`Prereserva ${r.referencia}`, formulario(r), 200, res);
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).send("Método no permitido.");
  }

  // ─── Decisión ─────────────────────────────────────────────────────────
  if (r.estado !== "pendiente") return pagina("Ya resuelta", yaDecidida(r), 200, res);

  const accion = String(entrada.accion ?? "");
  if (accion !== "aceptar" && accion !== "rechazar") {
    return pagina("Prereserva", formulario(r, "Pulsa uno de los dos botones."), 400, res);
  }

  const precio = aNumero(entrada.precio);
  if (accion === "aceptar" && precio === null) {
    return pagina(
      "Prereserva",
      formulario(r, "Para aceptar hace falta el precio. Escríbelo y vuelve a darle."),
      400, res
    );
  }

  const mensaje = String(entrada.mensaje ?? "").trim().slice(0, 1000) || null;
  const estado = accion === "aceptar" ? "aceptada" : "rechazada";

  let actualizada;
  try {
    const { data, error } = await db()
      .from("prereservas")
      .update({
        estado,
        precio: accion === "aceptar" ? precio : null,
        mensaje,
        decidida_at: new Date().toISOString(),
      })
      .eq("referencia", r.referencia)
      .eq("estado", "pendiente")   // si alguien ya decidió, aquí no entra
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      const fresca = await buscar(r.referencia, t);
      return pagina("Ya resuelta", yaDecidida(fresca ?? r), 200, res);
    }
    actualizada = data;
  } catch (e) {
    console.error("[decidir] No se ha podido guardar la decisión:", e.message);
    return pagina("Error", `<h1>No se ha guardado</h1>
      <p>La decisión no ha llegado a grabarse y no se ha enviado ningún correo.
      Vuelve a abrir el enlace e inténtalo otra vez.</p>`, 500, res);
  }

  const enviado = await enviarCorreo({
    para: actualizada.email,
    asunto: estado === "aceptada"
      ? `Plaza confirmada · ${actualizada.referencia}`
      : `Sobre tu solicitud · ${actualizada.referencia}`,
    html: estado === "aceptada"
      ? correoClienteAceptada(actualizada)
      : correoClienteRechazada(actualizada),
  });

  const color = estado === "aceptada" ? "#15803D" : "#B3261E";
  return pagina("Hecho", `
    <h1>${estado === "aceptada" ? "Reserva aceptada" : "Reserva rechazada"}</h1>
    <p><span class="sello" style="background:${color}">${estado.toUpperCase()}</span></p>
    ${enviado
      ? `<p>Ya se lo hemos contado a ${limpiar(actualizada.nombre)}
         por correo a ${limpiar(actualizada.email)}.</p>`
      : `<p class="error">La decisión está guardada, pero el correo al cliente
         <strong>no ha salido</strong>. Avísale tú a ${limpiar(actualizada.email)}
         o al ${limpiar(actualizada.telefono)}.</p>`}
    ${estado === "aceptada" ? `<p><strong>Precio enviado: ${euros(actualizada.precio)}</strong></p>` : ""}
    ${resumen(actualizada)}
  `, 200, res);
}
