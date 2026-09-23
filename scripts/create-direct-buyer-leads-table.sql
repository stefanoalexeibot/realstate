-- ─────────────────────────────────────────────────────────────────────────────
-- Cima Propiedades — Tabla de leads de compra directa
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS re_direct_buyer_leads (
  id                   uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz   NOT NULL DEFAULT now(),

  -- Contacto
  name                 text          NOT NULL,
  phone                text          NOT NULL,

  -- Ubicación
  municipality         text          NOT NULL,
  colonia              text,
  property_address     text,
  property_latitude    double precision,
  property_longitude   double precision,

  -- Propiedad
  property_type        text          NOT NULL,       -- casa | departamento | terreno | local_comercial | otro
  property_condition   text          NOT NULL,       -- excelente | bueno | regular | deteriorado
  property_situations  text[]        NOT NULL DEFAULT '{}',
  is_owner             boolean       NOT NULL DEFAULT true,
  timeline             text          NOT NULL,       -- urgente | 1_3_meses | 3_6_meses | mas_6_meses | explorando
  bedrooms             smallint      CHECK (bedrooms IS NULL OR bedrooms BETWEEN 0 AND 20),
  visit_requested      boolean       NOT NULL DEFAULT false,
  preferred_visit_date date,
  preferred_visit_time time,

  -- Calificación automática
  qualification_status text          NOT NULL,       -- qualified | manual_review | out_of_coverage

  -- Analítica (sin datos sensibles)
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  source               text          NOT NULL DEFAULT 'te-compramos-landing',

  -- Seguimiento interno (Cima llena estos campos manualmente)
  pipeline_stage       text          NOT NULL DEFAULT 'nuevo',
  notes                text,
  assigned_to          text
);

-- Compatibilidad con instalaciones donde la tabla ya existía.
ALTER TABLE re_direct_buyer_leads
  ADD COLUMN IF NOT EXISTS bedrooms smallint
    CHECK (bedrooms IS NULL OR bedrooms BETWEEN 0 AND 20),
  ADD COLUMN IF NOT EXISTS visit_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS preferred_visit_date date,
  ADD COLUMN IF NOT EXISTS preferred_visit_time time,
  ADD COLUMN IF NOT EXISTS property_address text,
  ADD COLUMN IF NOT EXISTS property_latitude double precision,
  ADD COLUMN IF NOT EXISTS property_longitude double precision;

-- Índices útiles para el equipo de Cima
CREATE INDEX IF NOT EXISTS idx_direct_buyer_leads_status
  ON re_direct_buyer_leads (qualification_status);

CREATE INDEX IF NOT EXISTS idx_direct_buyer_leads_municipality
  ON re_direct_buyer_leads (municipality);

CREATE INDEX IF NOT EXISTS idx_direct_buyer_leads_created
  ON re_direct_buyer_leads (created_at DESC);

-- Row Level Security: solo el service role puede escribir (el admin client usa service role)
ALTER TABLE re_direct_buyer_leads ENABLE ROW LEVEL SECURITY;

-- Política: el service role omite RLS automáticamente en Supabase
-- Si necesitas acceso desde el dashboard, agrega una política para tu rol de admin:
-- CREATE POLICY "Admin full access" ON re_direct_buyer_leads
--   FOR ALL TO authenticated
--   USING (auth.jwt() ->> 'role' IN ('admin', 'agent'));
