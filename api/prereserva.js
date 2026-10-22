import { db, nuevaReferencia, nuevoToken } from "./_lib/db.js";
import { enviarCorreo } from "./_lib/correo.js";
import { correoClienteRecibida, correoPlaferNueva } from "./_lib/plantillas.js";

const CAMPOS_OBLIGATORIOS = ["garaje", "entrada", "salida", "matricula", "nombre", "telefono", "email"];
const LARGO_MAXIMO = { notas: 1000, vehiculo: 120, nombre: 160, garaje: 120, matricula: 20, telefono: 40, email: 200 };

function baseDelSitio(req) {
  if (process.env.SITIO_URL) return process.env.SITIO_URL.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Solo se admite POST." });
  }

  const cuerpo = req.body || {};

  // ─── Comprobaciones ───────────────────────────────────────────────────
  for (const campo of CAMPOS_OBLIGATORIOS) {
    if (!String(cuerpo[campo] ?? "").trim()) {
      return res.status(400).json({ error: `Falta ${campo}.` });
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(cuerpo.email).trim())) {
    return res.status(400).json({ error: "El correo no es válido." });
  }

  const entrada = String(cuerpo.entrada).slice(0, 10);
  const salida = String(cuerpo.salida).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entrada) || !/^\d{4}-\d{2}-\d{2}$/.test(salida)) {
    return res.status(400).json({ error: "Las fechas no son válidas." });
  }
  if (new Date(salida) < new Date(entrada)) {
    return res.status(400).json({ error: "La salida no puede ser anterior a la entrada." });
  }

  // Recortar por si alguien manda un texto enorme.
  const corta = (v, campo) => String(v ?? "").trim().slice(0, LARGO_MAXIMO[campo] ?? 200);

  const fila = {
    referencia: nuevaReferencia(),
    token: nuevoToken(),
    garaje: corta(cuerpo.garaje, "garaje"),
    entrada,
    salida,
    matricula: corta(cuerpo.matricula, "matricula").toUpperCase(),
    vehiculo: corta(cuerpo.vehiculo, "vehiculo") || null,
    nombre: corta(cuerpo.nombre, "nombre"),
    telefono: corta(cuerpo.telefono, "telefono"),
    email: corta(cuerpo.email, "email").toLowerCase(),
    notas: corta(cuerpo.notas, "notas") || null,
    estado: "pendiente",
  };

  // ─── Guardar ──────────────────────────────────────────────────────────
  let guardada;
  try {
    const { data, error } = await db()
      .from("prereservas")
      .insert(fila)
      .select()
      .single();
    if (error) throw error;
    guardada = data;
  } catch (e) {
    console.error("[prereserva] No se ha podido guardar:", e.message);
    return res.status(500).json({ error: "No se ha podido guardar la solicitud." });
  }

  // ─── Avisar ───────────────────────────────────────────────────────────
  // Si falla un correo, la solicitud ya está guardada: no se pierde.
  const enlace = `${baseDelSitio(req)}/api/decidir?ref=${encodeURIComponent(guardada.referencia)}&t=${guardada.token}`;
  const destinoPlafer = process.env.CORREO_PLAFER;

  const avisos = [
    enviarCorreo({
      para: guardada.email,
      asunto: `Hemos recibido tu solicitud · ${guardada.referencia}`,
      html: correoClienteRecibida(guardada),
    }),
  ];

  if (destinoPlafer) {
    avisos.push(
      enviarCorreo({
        para: destinoPlafer,
        asunto: `Nueva prereserva · ${guardada.garaje} · ${guardada.referencia}`,
        html: correoPlaferNueva(guardada, enlace),
      })
    );
  } else {
    console.error("[prereserva] Falta CORREO_PLAFER: nadie recibirá el aviso.");
  }

  await Promise.all(avisos);

  return res.status(200).json({ ok: true, referencia: guardada.referencia });
}
