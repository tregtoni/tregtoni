-- Run this in Supabase SQL Editor
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS km             integer,
  ADD COLUMN IF NOT EXISTS zustand        text,
  ADD COLUMN IF NOT EXISTS baujahr        integer,
  ADD COLUMN IF NOT EXISTS kraftstoff     text,
  ADD COLUMN IF NOT EXISTS leistung_ps    integer,
  ADD COLUMN IF NOT EXISTS getriebe       text,
  ADD COLUMN IF NOT EXISTS fahrzeugtyp    text,
  ADD COLUMN IF NOT EXISTS tueren         text,
  ADD COLUMN IF NOT EXISTS umweltplakette text,
  ADD COLUMN IF NOT EXISTS schadstoffklasse text,
  ADD COLUMN IF NOT EXISTS innen_material text,
  ADD COLUMN IF NOT EXISTS farbe          text,
  ADD COLUMN IF NOT EXISTS ausstattung    text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS innen_ausstattung text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sicherheit     text[] DEFAULT '{}';
