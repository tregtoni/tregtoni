-- Add zeige_kontaktperson column to profiles
-- Controls whether the contact person name is shown on the public business profile

alter table profiles
  add column if not exists zeige_kontaktperson boolean not null default true;
