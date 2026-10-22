// =========================================================================
// Todos los datos del negocio en un solo sitio.
// Para cambiar un precio, un horario o un teléfono se toca AQUÍ y cambia
// en toda la web. No hay que buscarlo por los componentes.
// =========================================================================

// ─── TARIFAS ─────────────────────────────────────────────────────────────
// Estos son los números del cartel oficial colgado en el parking
// ("TARIFES D'APARCAMENT 2026", Gremi de Garatges de Barcelona i Província),
// fotografiado en /public/fotos/img_6706.jpg.
//
// El documento "web Plafer.docx" dice otros (0,105 / 0,05 / 24,55 €), más
// viejos. Si los buenos fueran esos, se cambian estas tres líneas.
export const TARIFAS = {
  primerTramo: { texto: "Primeros 10 minutos", precio: "0,10 €/min" },
  restoTiempo: { texto: "Del minuto 11 en adelante", precio: "0,06 €/min" },
  maximoDia:   { texto: "Máximo por 24 horas", precio: "27,40 €" },
  nota: "Para unas horas o un día suelto no reserves: ven cuando quieras y paga al salir.",
};

// Descuento que se aplica al reservar directamente, sin intermediarios.
export const DESCUENTO_DIRECTO = 10; // %

// ─── APARCAMIENTOS ───────────────────────────────────────────────────────
export const PARKINGS = [
  {
    id: "mallorca",
    nombre: "Plafer Mallorca",
    barrio: "Eixample",
    descripcion:
      "En pleno Eixample, a un paseo de la Pedrera, Casa Batlló y el centro. Renovado hace poco.",
    direccion: "C. de Mallorca, 219–221",
    cp: "08008 Barcelona",
    telefono: "934 53 53 84",
    telefonoLink: "+34934535384",
    mapa: "https://www.google.com/maps/search/?api=1&query=Carrer+de+Mallorca+219+Barcelona",
    servicios: [
      { icono: "techo",    texto: "Cubierto" },
      { icono: "camara",   texto: "Vigilado, con cámaras 24 h" },
      { icono: "reloj",    texto: "Abierto 24 h, todos los días" },
      // El cartel de la entrada dice ALÇADA MAX 1'85.
      { icono: "medidas",  texto: "Altura máxima 1,85 m" },
    ],
    fotoPrincipal: {
      src: "/fotos/img_6707.jpg",
      alt: "Entrada del parking desde la calle Mallorca, con el cartel azul ENTRADA PARKING y una flecha hacia abajo.",
    },
    fotos: [
      {
        src: "/fotos/img_6705.jpg",
        alt: "Interior del garaje: paso de peatones pintado en azul que separa a la gente de los coches.",
      },
      {
        src: "/fotos/img_6709.jpg",
        alt: "Pasillo interior del garaje con coches aparcados al fondo y el semáforo verde de salida.",
      },
    ],
  },
  {
    id: "abanto",
    nombre: "Plafer Abanto",
    barrio: "Plaça d'Espanya",
    descripcion:
      "Junto a la Gran Via y Plaça d'Espanya, cerca de Montjuïc, la Fira y Las Arenas. De obra nueva, con plazas amplias y maniobras fáciles.",
    direccion: "C. de Sant Pere d'Abanto, 14",
    cp: "08014 Barcelona",
    telefono: "933 32 28 51",
    telefonoLink: "+34933322851",
    mapa: "https://www.google.com/maps/search/?api=1&query=Carrer+de+Sant+Pere+d'Abanto+14+Barcelona",
    servicios: [
      { icono: "techo",   texto: "Cubierto" },
      { icono: "camara",  texto: "Vigilancia de día" },
      { icono: "reloj",   texto: "Entras de lunes a sábado, 7:00–22:00 · sales a cualquier hora" },
      { icono: "medidas", texto: "Hasta 2,20 alto · 3,00 ancho · 6,00 largo" },
    ],
    // Todavía no hay fotos de Abanto.
    fotoPrincipal: null,
    fotos: [],
  },
];

// ─── EMPRESA ─────────────────────────────────────────────────────────────
export const EMPRESA = {
  nombre: "Plafer Parking",
  razonSocial: "Garatges Plafer S.L.U.",
  gremio: "Afiliados al Gremi de Garatges de Barcelona i Província",
  // Provisional. Cuando haya dominio propio, aquí va el correo bueno.
  correo: "garatgesplafes@hotmail.com",
};

// Foto ancha de la portada.
export const FOTO_PORTADA = {
  src: "/fotos/img_6710.jpg",
  alt: "Cartel luminoso azul con la palabra PARKING y dos flechas hacia abajo, dentro del garaje.",
};

// Foto del cartel de tarifas, que se enseña junto a la tabla de precios.
export const FOTO_CARTEL = {
  src: "/fotos/img_6706.jpg",
  alt: "Cartel oficial de tarifas del Gremi de Garatges de Barcelona colgado en la pared del parking.",
};
