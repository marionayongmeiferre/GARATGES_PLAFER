// Envío de correo con Resend. Una sola función para todo el proyecto.
// Si falta la clave, no revienta: lo deja escrito en el registro y
// devuelve false, para que una reserva no se pierda por un fallo de correo.

export async function enviarCorreo({ para, asunto, html }) {
  const clave = process.env.RESEND_API_KEY;
  const remitente = process.env.CORREO_REMITENTE || "Plafer Parking <onboarding@resend.dev>";

  if (!clave) {
    console.error("[correo] Falta RESEND_API_KEY. No se ha enviado:", asunto, "→", para);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clave}`,
      },
      body: JSON.stringify({ from: remitente, to: [para], subject: asunto, html }),
    });

    if (!res.ok) {
      console.error("[correo] Resend ha fallado:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[correo] No se ha podido llamar a Resend:", e.message);
    return false;
  }
}
