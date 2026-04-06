-- Add phone, city, avatar to profiles table
alter table profiles add column if not exists telefon    text;
alter table profiles add column if not exists qyteti     text;
alter table profiles add column if not exists avatar_url text;

-- Storage bucket for profile pictures
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Auth users upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "Auth users update avatars"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');

create policy "Public read avatars"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');
