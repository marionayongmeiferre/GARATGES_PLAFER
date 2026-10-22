# Plafer Parking

Web de los dos aparcamientos de Barcelona, con un sistema de **prereservas por correo**
para estancias largas.

No se cobra nada por internet. El cliente pide, Plafer responde con el precio, y se paga
en el garaje. El objetivo es dejar de pagar comisión a los intermediarios.

---

## Cómo funciona una reserva, paso a paso

1. El cliente rellena el formulario de la web
2. La solicitud **se guarda** en la base de datos con un número de referencia (`PL-7K3M9A`)
3. **Al cliente** le llega un correo: "hemos recibido tu solicitud", con el resumen
4. **A Plafer** le llega otro correo con todos los datos y un botón: *Aceptar o rechazar*
5. Ese botón abre una página con la solicitud, una casilla para el **precio** y dos botones
6. Al pulsar, **al cliente** le llega el correo con la respuesta: confirmada con su precio, o no

No hay usuario ni contraseña. Quien tiene acceso al buzón de Plafer, decide. El enlace
lleva un código secreto largo, así que nadie puede aceptar reservas ajenas.

Si alguien abre un enlace ya resuelto, la página lo dice y **no** manda un segundo correo.

---

## Montarlo la primera vez

### 1. Supabase — la base de datos

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto
2. Ve a **SQL Editor → New query**, pega todo el contenido de `supabase/schema.sql` y dale a **Run**
3. Ve a **Settings → API** y apunta dos cosas: la **Project URL** y la clave **service_role**

> La clave `service_role` es la que lo abre todo. No la enseñes a nadie y no la pegues
> nunca en un fichero que acabe en GitHub.

### 2. Resend — el envío de correos

1. Entra en [resend.com](https://resend.com), crea la cuenta y saca una **API Key**
2. **Importante:** hasta que no verifiques un dominio propio, Resend solo deja mandar
   correos *a tu propia dirección*. Con eso se puede probar, pero los clientes no
   recibirían nada. Para que funcione de verdad hay que verificar el dominio de Plafer
   en **Domains → Add Domain** y poner un remitente tipo `reservas@plafer.com`

### 3. Vercel — publicar la web

1. Importa el repositorio de GitHub en [vercel.com](https://vercel.com)
2. Detecta Vite solo; no hay que tocar la configuración
3. En **Settings → Environment Variables** mete las cinco variables que aparecen
   en `.env.example`
4. Vuelve a desplegar para que las coja

---

## Trabajar en el ordenador

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`.

Con `npm run dev` **el formulario no envía**: las funciones de `/api` solo corren en
Vercel. Para probarlo entero en local hace falta `vercel dev`.

---

## Dónde se cambian las cosas

| Qué | Dónde |
|---|---|
| Precios, horarios, direcciones, teléfonos, fotos | `src/datos.js` |
| Colores y tipografías | `tailwind.config.js` |
| Textos de los correos | `api/_lib/plantillas.js` |
| La página de aceptar/rechazar | `api/decidir.js` |
| A qué correo llegan los avisos | variable `CORREO_PLAFER` en Vercel |

---

## Ver las reservas

Panel de Supabase → **Table editor** → `prereservas`.

Las pendientes:

```sql
select referencia, nombre, garaje, entrada, salida, telefono, email
from public.prereservas
where estado = 'pendiente'
order by created_at desc;
```

---

## Pendiente

- **Confirmar las tarifas.** La web usa las del cartel oficial de 2026 que hay colgado en
  el parking (0,10 €/min · 0,06 €/min · 27,40 € al día). El documento `web Plafer.docx`
  decía otras más viejas. Si las buenas son las del documento, se cambian en `src/datos.js`
- **Correo definitivo de Plafer** (ahora hay uno de Hotmail, provisional)
- **Dominio propio**, necesario para que Resend pueda escribir a los clientes
- **Fotos de Plafer Abanto**: no hay ninguna. En la web se ven los huecos marcados
- **Estilo visual**: sin decidir. La paleta de `tailwind.config.js` es neutra a propósito
- **Páginas legales**: aviso legal, privacidad y condiciones están enlazadas pero vacías.
  Hacen falta antes de publicar, porque se recogen datos personales
- **Precio de estancia larga**: no está publicado en ningún sitio. Se decide reserva a reserva

---

## Qué guarda `usage.js`

Un registro de uso **local**: qué se toca y cuándo, solo en el navegador del visitante.
Nunca matrículas, nombres, correos, teléfonos ni nada escrito en el formulario. No sale
del navegador: no hay ninguna llamada a ningún servidor. Para verlo, en la consola del
navegador: `usage.ver()`.
