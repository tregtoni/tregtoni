-- Run this in Supabase SQL Editor
ALTER TABLE njoftimet
  ADD COLUMN IF NOT EXISTS apt_type       text,
  ADD COLUMN IF NOT EXISTS shkembim       text,
  ADD COLUMN IF NOT EXISTS pajisjet       text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS karakteristika text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS siperfaqja     integer,
  ADD COLUMN IF NOT EXISTS dhoma          integer,
  ADD COLUMN IF NOT EXISTS kati           integer,
  ADD COLUMN IF NOT EXISTS disponueshem   text;
