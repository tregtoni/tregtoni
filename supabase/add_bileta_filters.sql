-- Bileta & Evente filters
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS data_eventit text,
  ADD COLUMN IF NOT EXISTS bileta_lloji text,
  ADD COLUMN IF NOT EXISTS destinacioni text;
