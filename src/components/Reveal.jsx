import { motion, useReducedMotion } from "framer-motion";

// Aparición suave al entrar en pantalla. Si el sistema pide menos
// movimiento, no se mueve nada: solo aparece.
export default function Reveal({ children, delay = 0, y = 18, className = "" }) {
  const quieto = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: quieto ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
