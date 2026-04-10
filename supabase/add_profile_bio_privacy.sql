-- Add bio and privacy settings to profiles
alter table profiles add column if not exists bio           text;
alter table profiles add column if not exists zeige_telefon boolean not null default true;
alter table profiles add column if not exists zeige_qyteti  boolean not null default true;
