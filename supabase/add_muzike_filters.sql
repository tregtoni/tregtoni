-- Muzike filters
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS muzike_lloji text,
  ADD COLUMN IF NOT EXISTS muzike_zhanri text;
