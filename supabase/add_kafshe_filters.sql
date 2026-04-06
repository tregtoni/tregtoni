-- Kafshë shtëpiake filters
-- Note: gjinia and mosha already exist from add_femije_filters.sql
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS raca         text,
  ADD COLUMN IF NOT EXISTS me_origjine  text,
  ADD COLUMN IF NOT EXISTS kafshe_lloji text;
