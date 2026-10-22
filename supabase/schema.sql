-- =========================================================================
-- PLAFER PARKING · Supabase
-- Dónde se ejecuta: panel de Supabase → SQL Editor → New query →
-- pegar esto entero → Run.
-- =========================================================================

-- ─── PRERESERVAS ────────────────────────────────────────────────────────
-- Una fila por solicitud. El estado manda:
--   pendiente  → recién llegada, nadie la ha mirado
--   aceptada   → hay plaza, con un precio cerrado
--   rechazada  → no hay plaza, o no interesa
create table if not exists public.prereservas (
  id           bigint generated always as identity primary key,

  referencia   text   not null unique,   -- lo que ve el cliente: PL-7K3M9A
  token        text   not null,          -- secreto del enlace para decidir

  garaje       text   not null,
  entrada      date   not null,
  salida       date   not null,

  matricula    text   not null,
  vehiculo     text,

  nombre       text   not null,
  telefono     text   not null,
  email        text   not null,
  notas        text,

  estado       text   not null default 'pendiente',
  precio       numeric(10,2),            -- solo si se acepta
  mensaje      text,                     -- lo que se le escribe al cliente

  created_at   timestamptz not null default now(),
  decidida_at  timestamptz
);

create index if not exists prereservas_estado_idx  on public.prereservas (estado, created_at desc);
create index if not exists prereservas_entrada_idx on public.prereservas (entrada);

-- ─── SEGURIDAD ──────────────────────────────────────────────────────────
-- RLS encendido y SIN ninguna política pública: desde el navegador no se
-- puede leer ni escribir nada. Todo pasa por las funciones de /api, que
-- usan la clave de servicio y se saltan RLS. Esa clave vive en Vercel y
-- nunca llega al navegador.
alter table public.prereservas enable row level security;

drop policy if exists "prereservas_sin_acceso_publico" on public.prereservas;

-- ─── CÓMO MIRARLAS ──────────────────────────────────────────────────────
-- Panel de Supabase → Table editor → prereservas.
-- Las pendientes, de la más nueva a la más vieja:
--
--   select referencia, nombre, garaje, entrada, salida, telefono, email
--   from public.prereservas
--   where estado = 'pendiente'
--   order by created_at desc;
