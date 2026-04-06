ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS dergesa   text,
  ADD COLUMN IF NOT EXISTS pajisja   text,
  ADD COLUMN IF NOT EXISTS ngjyra    text,
  ADD COLUMN IF NOT EXISTS ram       text,
  ADD COLUMN IF NOT EXISTS os        text,
  ADD COLUMN IF NOT EXISTS madhesia  text,
  ADD COLUMN IF NOT EXISTS el_lloji  text,
  ADD COLUMN IF NOT EXISTS platforma text;
