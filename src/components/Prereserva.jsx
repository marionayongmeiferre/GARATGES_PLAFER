import { useMemo, useState } from "react";
import Icono from "./Icono";
import { PARKINGS } from "../datos";

const VACIO = {
  garaje: PARKINGS[0].nombre,
  entrada: "",
  salida: "",
  matricula: "",
  vehiculo: "",
  nombre: "",
  telefono: "",
  email: "",
  notas: "",
};

const OBLIGATORIOS = [
  ["garaje",    "Elige en qué aparcamiento quieres la plaza."],
  ["entrada",   "Falta el día de entrada."],
  ["salida",    "Falta el día de salida."],
  ["matricula", "Falta la matrícula del coche."],
  ["nombre",    "Falta tu nombre."],
  ["telefono",  "Falta un teléfono donde avisarte."],
  ["email",     "Falta tu correo: ahí te mandamos la respuesta."],
];

function hoyISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function Campo({ id, etiqueta, icono, opcional, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-center gap-2 text-[15px] font-semibold">
        {icono && <Icono nombre={icono} className="h-4 w-4 text-plafer-marca" />}
        {etiqueta}
        {opcional && <span className="font-normal text-plafer-humo">(opcional)</span>}
      </label>
      {children}
      {error && <p className="text-[14px] text-plafer-no">{error}</p>}
    </div>
  );
}

const CLASES_CAMPO =
  "focus-ring w-full border border-plafer-linea bg-plafer-nieve px-3.5 py-3 text-[16px] " +
  "focus:bg-plafer-papel";

export default function Prereserva() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("escribiendo"); // escribiendo | enviando | hecho
  const [referencia, setReferencia] = useState("");
  const [fallo, setFallo] = useState("");

  const dias = useMemo(() => {
    if (!datos.entrada || !datos.salida) return null;
    const a = new Date(datos.entrada);
    const b = new Date(datos.salida);
    return Math.round((b - a) / 86400000);
  }, [datos.entrada, datos.salida]);

  function cambiar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  }

  function validar() {
    const nuevos = {};
    for (const [campo, mensaje] of OBLIGATORIOS) {
      if (!String(datos[campo]).trim()) nuevos[campo] = mensaje;
    }
    if (!nuevos.salida && dias !== null && dias < 0) {
      nuevos.salida = "El día de salida tiene que ser posterior al de entrada.";
    }
    if (!nuevos.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) {
      nuevos.email = "Ese correo no parece correcto. Míralo otra vez.";
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function enviar(ev) {
    ev.preventDefault();
    setFallo("");
    if (!validar()) return;

    setEstado("enviando");
    try {
      const res = await fetch("/api/prereserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, matricula: datos.matricula.trim().toUpperCase() }),
      });
      const cuerpo = await res.json();
      if (!res.ok) throw new Error(cuerpo.error || "No se ha podido enviar.");

      setReferencia(cuerpo.referencia);
      setEstado("hecho");
      window.usage?.anotar("prereserva-enviada", `${datos.garaje} / ${dias}d`);
    } catch (e) {
      setEstado("escribiendo");
      setFallo(
        "No hemos podido enviar la solicitud. Inténtalo otra vez en un momento, " +
        "o llámanos al " + PARKINGS[0].telefono + "."
      );
    }
  }

  if (estado === "hecho") {
    return (
      <section id="prereserva" className="border-b border-plafer-linea bg-plafer-papel">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
          <div className="max-w-xl border border-plafer-linea bg-plafer-nieve p-8 md:p-10">
            <Icono nombre="si" className="h-9 w-9 text-plafer-ok" />
            <h2 className="mt-5 text-[1.8rem] font-bold leading-tight tracking-tightest">
              Solicitud recibida
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-plafer-humo">
              Te hemos mandado un correo con el resumen. Te respondemos con el precio
              lo antes posible.
            </p>
            <p className="mt-6 text-[15px] text-plafer-humo">Tu número de referencia:</p>
            <p className="tabular mt-1 text-[1.6rem] font-bold tracking-tight">{referencia}</p>
            <button
              type="button"
              onClick={() => { setDatos(VACIO); setEstado("escribiendo"); setReferencia(""); }}
              className="focus-ring mt-8 border border-plafer-tinta px-5 py-2.5 text-[15px] font-semibold transition-colors hover:bg-plafer-tinta hover:text-white"
            >
              Hacer otra prereserva
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="prereserva" className="border-b border-plafer-linea bg-plafer-papel">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">

        <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tightest">
          Pedir prereserva
        </h2>
        <p className="mt-4 max-w-lectura text-[1.05rem] text-plafer-humo">
          Solo para estancias largas. Si vienes unas horas o un día, no uses esto: entra
          directamente y paga por minutos al salir.
        </p>

        <form onSubmit={enviar} noValidate className="mt-12 max-w-3xl border border-plafer-linea p-6 md:p-10">
          <div className="grid gap-6 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <Campo id="garaje" etiqueta="Aparcamiento" icono="mapa" error={errores.garaje}>
                <select
                  id="garaje"
                  className={CLASES_CAMPO}
                  value={datos.garaje}
                  onChange={(e) => cambiar("garaje", e.target.value)}
                >
                  {PARKINGS.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre} — {p.direccion}
                    </option>
                  ))}
                  <option value="Cualquiera de los dos">Me da igual cuál de los dos</option>
                </select>
              </Campo>
            </div>

            <Campo id="entrada" etiqueta="Día de entrada" icono="fecha" error={errores.entrada}>
              <input
                id="entrada" type="date" className={CLASES_CAMPO} min={hoyISO()}
                value={datos.entrada} onChange={(e) => cambiar("entrada", e.target.value)}
              />
            </Campo>

            <Campo id="salida" etiqueta="Día de salida" icono="fecha" error={errores.salida}>
              <input
                id="salida" type="date" className={CLASES_CAMPO}
                min={datos.entrada || hoyISO()}
                value={datos.salida} onChange={(e) => cambiar("salida", e.target.value)}
              />
            </Campo>

            {dias !== null && dias >= 0 && (
              <p className="sm:col-span-2 -mt-2 font-semibold text-plafer-marca" role="status">
                {dias === 0 ? "Entras y sales el mismo día." : dias === 1 ? "Una noche." : `${dias} días.`}
              </p>
            )}

            <Campo id="matricula" etiqueta="Matrícula" icono="coche" error={errores.matricula}>
              <input
                id="matricula" type="text" className={CLASES_CAMPO} placeholder="0000 ABC"
                autoComplete="off" value={datos.matricula}
                onChange={(e) => cambiar("matricula", e.target.value)}
              />
            </Campo>

            <Campo id="vehiculo" etiqueta="Marca y modelo" opcional>
              <input
                id="vehiculo" type="text" className={CLASES_CAMPO} placeholder="Seat León"
                autoComplete="off" value={datos.vehiculo}
                onChange={(e) => cambiar("vehiculo", e.target.value)}
              />
            </Campo>

            <Campo id="nombre" etiqueta="Nombre y apellidos" error={errores.nombre}>
              <input
                id="nombre" type="text" className={CLASES_CAMPO} autoComplete="name"
                value={datos.nombre} onChange={(e) => cambiar("nombre", e.target.value)}
              />
            </Campo>

            <Campo id="telefono" etiqueta="Teléfono" icono="telefono" error={errores.telefono}>
              <input
                id="telefono" type="tel" className={CLASES_CAMPO} autoComplete="tel"
                value={datos.telefono} onChange={(e) => cambiar("telefono", e.target.value)}
              />
            </Campo>

            <div className="sm:col-span-2">
              <Campo id="email" etiqueta="Correo electrónico" icono="correo" error={errores.email}>
                <input
                  id="email" type="email" className={CLASES_CAMPO} autoComplete="email"
                  value={datos.email} onChange={(e) => cambiar("email", e.target.value)}
                />
              </Campo>
            </div>

            <div className="sm:col-span-2">
              <Campo id="notas" etiqueta="Algo que debamos saber" opcional>
                <textarea
                  id="notas" rows={3} className={CLASES_CAMPO}
                  placeholder="Furgoneta alta, llego de madrugada, entro y salgo varias veces…"
                  value={datos.notas} onChange={(e) => cambiar("notas", e.target.value)}
                />
              </Campo>
            </div>

            {fallo && (
              <p className="sm:col-span-2 border-l-4 border-plafer-no bg-plafer-no/5 px-4 py-3 text-[15px]" role="alert">
                {fallo}
              </p>
            )}

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-1">
              <button
                type="submit"
                disabled={estado === "enviando"}
                data-uso="enviar-prereserva"
                className="focus-ring bg-plafer-marca px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-plafer-tinta disabled:opacity-50"
              >
                {estado === "enviando" ? "Enviando…" : "Enviar la prereserva"}
              </button>
              <p className="max-w-[34ch] text-[14px] text-plafer-humo">
                Te escribimos con el precio. No se cobra nada hasta que lo confirmes.
              </p>
            </div>
          </div>
        </form>

        <aside className="mt-12 flex max-w-3xl items-start gap-4 border-l-4 border-plafer-marca pl-5">
          <Icono nombre="aviso" className="mt-1 h-6 w-6 shrink-0 text-plafer-marca" />
          <div>
            <h3 className="text-[1.05rem] font-bold">Antes de venir: Zona de Bajas Emisiones</h3>
            <p className="mt-2 max-w-[66ch] text-[15px] leading-relaxed text-plafer-humo">
              Los dos aparcamientos están dentro de la ZBE Rondes de Barcelona. De lunes a
              viernes, de 7:00 a 20:00, solo pueden circular los vehículos con etiqueta
              ambiental de la DGT. Tener plaza reservada no da derecho a entrar en la zona, y
              nosotros no podemos autorizarlo. Los coches matriculados fuera de España deben
              registrarse y pagar la tasa.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
