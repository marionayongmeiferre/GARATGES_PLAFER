import Icono from "./Icono";
import { PARKINGS } from "../datos";

export default function Nav() {
  const telefono = PARKINGS[0];

  return (
    <header className="sticky top-0 z-50 border-b border-plafer-linea bg-plafer-papel/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-5 py-3 md:gap-10 md:px-8">

        <a href="#inicio" className="focus-ring flex items-center gap-2.5">
          <span
            className="grid h-8 w-8 place-items-center bg-plafer-marca text-[17px] font-extrabold leading-none text-white"
            aria-hidden="true"
          >
            P
          </span>
          <span className="text-[19px] font-bold tracking-tightest">Plafer</span>
        </a>

        <nav className="ml-auto hidden gap-7 text-[15px] font-medium md:flex" aria-label="Principal">
          <a className="focus-ring hover:text-plafer-marca" href="#aparcamientos">Aparcamientos</a>
          <a className="focus-ring hover:text-plafer-marca" href="#tarifas">Tarifas</a>
          <a className="focus-ring hover:text-plafer-marca" href="#prereserva">Prereserva</a>
        </nav>

        <a
          href={`tel:${telefono.telefonoLink}`}
          className="focus-ring ml-auto inline-flex items-center gap-2 text-[15px] font-semibold text-plafer-marca md:ml-0"
        >
          <Icono nombre="telefono" className="h-4 w-4" />
          {telefono.telefono}
        </a>
      </div>
    </header>
  );
}
