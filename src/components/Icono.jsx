import {
  Warehouse, Camera, Clock, Ruler, MapPin, Phone, Car,
  Calendar, Mail, Euro, Info, Check, X,
} from "lucide-react";

// Un solo sitio donde se decide qué dibujo lleva cada concepto.
// Así "vigilado" es siempre la misma cámara en toda la web.
const MAPA = {
  techo:    Warehouse,
  camara:   Camera,
  reloj:    Clock,
  medidas:  Ruler,
  mapa:     MapPin,
  telefono: Phone,
  coche:    Car,
  fecha:    Calendar,
  correo:   Mail,
  precio:   Euro,
  aviso:    Info,
  si:       Check,
  no:       X,
};

export default function Icono({ nombre, className = "h-5 w-5", ...props }) {
  const Dibujo = MAPA[nombre];
  if (!Dibujo) return null;
  return <Dibujo className={className} aria-hidden="true" strokeWidth={1.6} {...props} />;
}
