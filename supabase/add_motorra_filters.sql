-- Run this in Supabase SQL Editor
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS cilindrata   integer,
  ADD COLUMN IF NOT EXISTS hu_gueltig   integer,
  ADD COLUMN IF NOT EXISTS moto_art     text,
  ADD COLUMN IF NOT EXISTS angebotstyp  text,
  ADD COLUMN IF NOT EXISTS ofruesi      text;
