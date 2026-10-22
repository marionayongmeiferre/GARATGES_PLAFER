import Icono from "./Icono";
import Reveal from "./Reveal";
import { TARIFAS, DESCUENTO_DIRECTO, FOTO_CARTEL } from "../datos";

export default function Tarifas() {
  const filas = [TARIFAS.primerTramo, TARIFAS.restoTiempo, TARIFAS.maximoDia];

  return (
    <section id="tarifas" className="border-b border-plafer-linea bg-plafer-papel">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">

        <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tightest">
          Tarifas
        </h2>
        <p className="mt-4 max-w-lectura text-[1.05rem] text-plafer-humo">
          Mismos precios en los dos aparcamientos.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">

          <div>
            <table className="w-full border-collapse">
              <caption className="pb-5 text-left">
                <Icono nombre="coche" className="mb-3 h-7 w-7 text-plafer-marca" />
                <span className="block text-[1.25rem] font-bold tracking-tightest">
                  Por minutos, sin reservar
                </span>
              </caption>
              <tbody>
                {filas.map((f, i) => (
                  <tr key={f.texto} className="border-t border-plafer-linea">
                    <th scope="row" className="py-4 text-left font-normal">{f.texto}</th>
                    <td
                      className={
                        "tabular py-4 text-right font-semibold " +
                        (i === filas.length - 1 ? "text-[1.35rem] text-plafer-marca" : "text-[1.1rem]")
                      }
                    >
                      {f.precio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-5 max-w-[42ch] text-[15px] text-plafer-humo">{TARIFAS.nota}</p>

            <Reveal delay={0.1}>
              <figure className="mt-8">
                <img
                  src={FOTO_CARTEL.src}
                  alt={FOTO_CARTEL.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full border border-plafer-linea object-cover object-[center_42%]"
                />
                <figcaption className="mt-2.5 text-[14px] text-plafer-humo">
                  El cartel de tarifas que hay colgado en el parking.
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <aside className="h-fit bg-plafer-nieve p-7 md:p-9">
            <Icono nombre="fecha" className="h-7 w-7 text-plafer-marca" />
            <h3 className="mt-5 text-[1.5rem] font-bold tracking-tightest">Estancias largas</h3>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-plafer-humo">
              A partir de varios días el precio no se calcula por minutos: te hacemos uno
              cerrado. Dinos las fechas y te respondemos con el importe. Esto sí conviene
              pedirlo antes.
            </p>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-plafer-humo">
              Pidiéndolo aquí, <strong className="font-bold text-plafer-tinta">un {DESCUENTO_DIRECTO}&nbsp;% menos</strong> que
              la tarifa habitual.
            </p>
            <a
              href="#prereserva"
              data-uso="tarifas-prereserva"
              className="focus-ring mt-7 inline-block bg-plafer-marca px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-plafer-tinta"
            >
              Pedir precio
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
