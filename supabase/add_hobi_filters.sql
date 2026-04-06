-- Hobi filters
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS hobi_lloji text,
  ADD COLUMN IF NOT EXISTS hobi_periudha text;
