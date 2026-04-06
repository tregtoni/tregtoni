-- Fëmijë & Bebe filters
-- Note: zustand (gjendja) and madhesia already exist from previous migrations
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS mosha        text,
  ADD COLUMN IF NOT EXISTS gjinia       text,
  ADD COLUMN IF NOT EXISTS femije_lloji text;
