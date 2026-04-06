-- Mësim & Kurse filters
-- Note: gjuha already exists from add_pune_filters.sql
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS mesim_lloji    text,
  ADD COLUMN IF NOT EXISTS mesim_niveli   text,
  ADD COLUMN IF NOT EXISTS gjuha_mesuar   text,
  ADD COLUMN IF NOT EXISTS lenda          text,
  ADD COLUMN IF NOT EXISTS mesim_sub_lloji text;
