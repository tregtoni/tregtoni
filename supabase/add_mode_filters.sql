ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS numri_kepuces text,
  ADD COLUMN IF NOT EXISTS mode_lloji    text;
