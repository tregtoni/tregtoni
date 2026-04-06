-- ============================================================
-- EKZEKUTO KËTË NË TËRËSI NË: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Shto kolonën images në tabelën njoftimet
alter table public.njoftimet
  add column if not exists images text[] not null default '{}';

-- 2. Krijo bucket storage (publik për lexim)
insert into storage.buckets (id, name, public)
values ('njoftimet-images', 'njoftimet-images', true)
on conflict (id) do update set public = true;

-- 3. Fshi politikat e vjetra nëse ekzistojnë
drop policy if exists "Fotot janë publike" on storage.objects;
drop policy if exists "Përdoruesit ngarkojnë foto" on storage.objects;
drop policy if exists "Pronari fshin fotot" on storage.objects;

-- 4. Politika e re: Të gjithë mund të lexojnë (bucket është publik)
create policy "njoftimet_images_select"
  on storage.objects for select
  to public
  using (bucket_id = 'njoftimet-images');

-- 5. Politika e re: Vetëm përdoruesit e autentikuar mund të ngarkojnë
create policy "njoftimet_images_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'njoftimet-images');

-- 6. Politika e re: Vetëm pronari mund të fshijë
create policy "njoftimet_images_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'njoftimet-images' and auth.uid()::text = owner);
