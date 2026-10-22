import { EMPRESA, PARKINGS } from "../datos";

export default function Footer() {
  return (
    <footer className="bg-plafer-tinta text-plafer-nieve">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-16 md:grid-cols-4 md:px-8 md:py-20">

        <div>
          <p className="text-[1.3rem] font-bold tracking-tightest">{EMPRESA.nombre}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/55">
            {EMPRESA.razonSocial}<br />
            Dos aparcamientos públicos en Barcelona.<br />
            {EMPRESA.gremio}.
          </p>
        </div>

        {PARKINGS.map((p) => (
          <div key={p.id}>
            <h2 className="text-[15px] font-bold">{p.nombre}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/55">
              {p.direccion}<br />
              {p.cp}<br />
              <a className="focus-ring underline underline-offset-4" href={`tel:${p.telefonoLink}`}>
                {p.telefono}
              </a>
            </p>
          </div>
        ))}

        <div>
          <h2 className="text-[15px] font-bold">Escríbenos</h2>
          <p className="mt-3 break-words text-[15px] leading-relaxed text-white/55">
            <a className="focus-ring underline underline-offset-4" href={`mailto:${EMPRESA.correo}`}>
              {EMPRESA.correo}
            </a>
          </p>
          <p className="mt-4 text-[14px] text-white/40">
            <a className="focus-ring underline underline-offset-4" href="#">Aviso legal</a>{" · "}
            <a className="focus-ring underline underline-offset-4" href="#">Privacidad</a>{" · "}
            <a className="focus-ring underline underline-offset-4" href="#">Condiciones</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
