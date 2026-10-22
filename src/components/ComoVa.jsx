import Icono from "./Icono";
import Reveal from "./Reveal";
import { DESCUENTO_DIRECTO } from "../datos";

const PASOS = [
  {
    icono: "fecha",
    titulo: "Nos dices las fechas",
    texto: "Rellenas el formulario con el garaje, los días y la matrícula. Un minuto.",
  },
  {
    icono: "correo",
    titulo: "Te confirmamos que ha llegado",
    texto: "Recibes al momento un correo con el resumen y tu número de referencia.",
  },
  {
    icono: "precio",
    titulo: "Te respondemos con el precio",
    texto: `Miramos si hay sitio y te escribimos: aceptada, con el importe y el ${DESCUENTO_DIRECTO} % ya aplicado, o no.`,
  },
  {
    icono: "coche",
    titulo: "Vienes y aparcas",
    texto: "Pagas aquí, en el garaje. Por internet no se cobra nada en ningún momento.",
  },
];

export default function ComoVa() {
  return (
    <section id="como-va" className="border-b border-plafer-linea bg-plafer-nieve">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">

        <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tightest">
          Cómo va la prereserva
        </h2>
        <p className="mt-4 max-w-lectura text-[1.05rem] text-plafer-humo">
          Cuatro pasos, todos por correo. No se paga nada por internet.
        </p>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p, i) => (
            <Reveal key={p.titulo} delay={i * 0.07} className="h-full">
              <li className="relative flex h-full flex-col border border-plafer-linea bg-plafer-papel p-6">
                <span
                  className="absolute right-0 top-0 grid h-10 w-10 place-items-center bg-plafer-marca text-[15px] font-bold text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <Icono nombre={p.icono} className="h-7 w-7 text-plafer-marca" />
                <h3 className="mt-5 max-w-[18ch] text-[1.15rem] font-bold leading-snug tracking-tightest">
                  {p.titulo}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-plafer-humo">{p.texto}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
