import Icono from "./Icono";
import Reveal from "./Reveal";
import { PARKINGS } from "../datos";

function HuecoFoto({ texto }) {
  return (
    <div className="grid aspect-[3/2] place-items-center gap-2 border-2 border-dashed border-plafer-linea bg-plafer-nieve p-6 text-center">
      <p className="max-w-[30ch] text-[14px] leading-snug text-plafer-humo">{texto}</p>
    </div>
  );
}

function Parking({ p }) {
  return (
    <article className="flex h-full flex-col gap-6 border border-plafer-linea bg-plafer-papel p-6 md:p-8">

      {p.fotoPrincipal ? (
        <figure className="aspect-[3/2] overflow-hidden bg-plafer-linea">
          <img src={p.fotoPrincipal.src} alt={p.fotoPrincipal.alt} className="h-full w-full object-cover" loading="lazy" />
        </figure>
      ) : (
        <HuecoFoto texto="Falta la foto de la entrada desde la calle." />
      )}

      <header>
        <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tightest">
          {p.nombre}
        </h3>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-plafer-marca">
          <Icono nombre="mapa" className="h-4 w-4" />
          {p.barrio}
        </p>
      </header>

      <p className="max-w-[44ch] text-[15px] leading-relaxed text-plafer-humo">{p.descripcion}</p>

      <ul className="flex flex-col gap-3">
        {p.servicios.map((s) => (
          <li key={s.texto} className="flex items-start gap-3 text-[15px]">
            <Icono nombre={s.icono} className="mt-0.5 h-5 w-5 shrink-0 text-plafer-marca" />
            <span>{s.texto}</span>
          </li>
        ))}
      </ul>

      <dl className="text-[15px]">
        <div className="grid grid-cols-[110px_1fr] gap-4 border-t border-plafer-linea py-3">
          <dt className="font-semibold">Dónde</dt>
          <dd>{p.direccion}<br />{p.cp}</dd>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-4 border-t border-plafer-linea py-3">
          <dt className="font-semibold">Teléfono</dt>
          <dd>
            <a className="focus-ring underline underline-offset-4" href={`tel:${p.telefonoLink}`}>
              {p.telefono}
            </a>
          </dd>
        </div>
      </dl>

      {p.fotos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {p.fotos.map((f) => (
            <figure key={f.src} className="aspect-square overflow-hidden bg-plafer-linea">
              <img src={f.src} alt={f.alt} className="h-full w-full object-cover" loading="lazy" />
            </figure>
          ))}
        </div>
      ) : (
        <p className="text-[14px] text-plafer-humo">Faltan las fotos del interior.</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-5 pt-1">
        <a
          href="#prereserva"
          data-uso={`parking-${p.id}`}
          className="focus-ring bg-plafer-marca px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-plafer-tinta"
        >
          Prereservar aquí
        </a>
        <a
          href={p.mapa}
          target="_blank"
          rel="noopener"
          className="focus-ring inline-flex items-center gap-1.5 text-[15px] font-semibold underline underline-offset-4"
        >
          <Icono nombre="mapa" className="h-4 w-4" />
          Abrir en el mapa
        </a>
      </div>
    </article>
  );
}

export default function Parkings() {
  return (
    <section id="aparcamientos" className="border-b border-plafer-linea bg-plafer-nieve">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">

        <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tightest">
          Los dos aparcamientos
        </h2>
        <p className="mt-4 max-w-lectura text-[1.05rem] text-plafer-humo">
          Mismas tarifas en los dos. Cambian la zona, el horario y el tamaño de coche que entra.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {PARKINGS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <Parking p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
