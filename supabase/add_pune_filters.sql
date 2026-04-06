ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS lloji_punes  text,
  ADD COLUMN IF NOT EXISTS fusha        text,
  ADD COLUMN IF NOT EXISTS lloji_voz    text,
  ADD COLUMN IF NOT EXISTS patenta      text,
  ADD COLUMN IF NOT EXISTS roli         text,
  ADD COLUMN IF NOT EXISTS gjuha        text,
  ADD COLUMN IF NOT EXISTS lloji_shitjes text;
