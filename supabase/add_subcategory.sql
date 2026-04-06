-- Shto kolonën subcategory në tabelën njoftimet
alter table public.njoftimet
  add column if not exists subcategory text not null default '';
