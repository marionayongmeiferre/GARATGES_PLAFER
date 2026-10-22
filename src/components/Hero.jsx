import Icono from "./Icono";
import Reveal from "./Reveal";
import { TARIFAS, DESCUENTO_DIRECTO, FOTO_PORTADA } from "../datos";

export default function Hero() {
  return (
    <section id="inicio" className="border-b border-plafer-linea bg-plafer-papel">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-24">

        <h1 className="max-w-[16ch] text-balance text-[clamp(2.4rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tightest">
          Por minutos o por días.
        </h1>

        <p className="mt-7 max-w-lectura text-pretty text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-plafer-humo">
          Dos garajes cubiertos y vigilados en el centro de Barcelona. Para un rato, entra
          directamente y paga por minutos: no hace falta reservar nada. Si vas a dejar el
          coche varios días, pídenos precio antes y te hacemos un {DESCUENTO_DIRECTO}&nbsp;% menos
          que la tarifa habitual.
        </p>

        {/* Las dos maneras de aparcar. Lo primero que tiene que entender
            quien llega: cuál de las dos es la suya. */}
        <div className="mt-12 grid gap-px overflow-hidden border border-plafer-linea bg-plafer-linea sm:grid-cols-2">

          <div className="bg-plafer-papel p-7">
            <Icono nombre="coche" className="h-7 w-7 text-plafer-marca" />
            <h2 className="mt-5 text-[1.3rem] font-bold tracking-tightest">Vengo un rato</h2>
            <p className="mt-2.5 max-w-[34ch] text-[15px] leading-relaxed text-plafer-humo">
              Entra sin avisar. Pagas por minutos al salir, con un máximo
              de {TARIFAS.maximoDia.precio} al día.
            </p>
            <a href="#tarifas" className="focus-ring mt-5 inline-block text-[15px] font-semibold text-plafer-marca underline underline-offset-4">
              Ver tarifas
            </a>
          </div>

          <div className="bg-plafer-nieve p-7">
            <Icono nombre="fecha" className="h-7 w-7 text-plafer-marca" />
            <h2 className="mt-5 text-[1.3rem] font-bold tracking-tightest">Dejo el coche días</h2>
            <p className="mt-2.5 max-w-[34ch] text-[15px] leading-relaxed text-plafer-humo">
              Pídenos precio antes de venir. Te lo cerramos y te hacemos
              un {DESCUENTO_DIRECTO}&nbsp;% de descuento.
            </p>
            <a
              href="#prereserva"
              data-uso="hero-prereserva"
              className="focus-ring mt-5 inline-block bg-plafer-marca px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-plafer-tinta"
            >
              Pedir prereserva
            </a>
          </div>
        </div>
      </div>

      <Reveal>
        <figure className="aspect-[21/9] w-full overflow-hidden bg-plafer-linea">
          <img
            src={FOTO_PORTADA.src}
            alt={FOTO_PORTADA.alt}
            className="h-full w-full object-cover"
          />
        </figure>
      </Reveal>
    </section>
  );
}
