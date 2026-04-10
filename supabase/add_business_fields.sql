-- Business account fields for profiles
alter table profiles add column if not exists konto_typ         text not null default 'privat';
alter table profiles add column if not exists firma_name        text;
alter table profiles add column if not exists adresa            text;
alter table profiles add column if not exists website           text;
alter table profiles add column if not exists beschreibung_firma text;

-- Update trigger to also copy konto_typ and firma_name from signup metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, konto_typ, firma_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'konto_typ', 'privat'),
    new.raw_user_meta_data->>'firma_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
