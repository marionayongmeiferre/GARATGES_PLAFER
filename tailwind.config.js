/** @type {import('tailwindcss').Config} */

// OJO: el estilo visual de Plafer está sin decidir. Esta paleta es
// provisional y deliberadamente neutra, para que se vea el contenido
// y no un diseño a medias. Cuando haya dirección de arte, se cambian
// estos valores y la web entera cambia con ellos.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plafer: {
          tinta:  "#141414",   // texto principal
          humo:   "#5E5E5E",   // texto secundario
          linea:  "#E3E2DD",   // bordes y separadores
          nieve:  "#F7F7F5",   // fondo claro
          papel:  "#FFFFFF",   // tarjetas
          marca:  "#1A47C2",   // acento: el azul de las señales de parking
          ok:     "#15803D",   // reserva aceptada
          no:     "#B3261E",   // reserva rechazada
        },
      },
      fontFamily: {
        sans:    ["'Outfit'", "system-ui", "sans-serif"],
        display: ["'Outfit'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "Consolas", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.015em",
      },
      maxWidth: {
        lectura: "62ch",
      },
    },
  },
  plugins: [],
};
