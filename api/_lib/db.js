import { createClient } from "@supabase/supabase-js";

// Cliente de servidor. Usa la clave de servicio, que se salta las reglas
// de seguridad de la tabla. Esta clave SOLO puede vivir aquí, en /api.
// Si acabara en el navegador, cualquiera podría leer todas las reservas.
let cliente = null;

export function db() {
  if (cliente) return cliente;

  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !clave) {
    throw new Error(
      "Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno."
    );
  }

  cliente = createClient(url, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

// Referencia corta y legible por teléfono: PL-7K3M9A.
// Sin vocales ni caracteres que se confundan (0/O, 1/I).
const LETRAS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function nuevaReferencia() {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += LETRAS[Math.floor(Math.random() * LETRAS.length)];
  }
  return `PL-${s}`;
}

// Secreto del enlace para aceptar o rechazar. Largo a propósito:
// quien no lo tenga no puede decidir sobre una reserva.
export function nuevoToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Comparación que tarda lo mismo acierte o falle, para que no se pueda
// adivinar el token probando y midiendo tiempos.
export function tokenIgual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}
