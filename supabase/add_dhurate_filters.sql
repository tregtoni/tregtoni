-- Dhurate filters
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS dhurate_lloji text,
  ADD COLUMN IF NOT EXISTS dhurate_kohezgjatja text;
