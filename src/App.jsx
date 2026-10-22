import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Parkings from "./components/Parkings";
import Tarifas from "./components/Tarifas";
import ComoVa from "./components/ComoVa";
import Prereserva from "./components/Prereserva";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <a
        href="#contenido"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[60] focus:bg-plafer-marca focus:px-5 focus:py-3 focus:text-white"
      >
        Saltar al contenido
      </a>

      <Nav />

      <main id="contenido">
        <Hero />
        <Parkings />
        <Tarifas />
        <ComoVa />
        <Prereserva />
      </main>

      <Footer />
    </>
  );
}
