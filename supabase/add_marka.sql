-- Shto kolonën marka në tabelën njoftimet (vetëm për kategorinë makina)
alter table public.njoftimet
  add column if not exists marka text not null default '';
