-- Add file columns to mesazhet table
alter table mesazhet add column if not exists file_url  text;
alter table mesazhet add column if not exists file_type text;

-- Storage bucket for chat files (images up to 20MB, PDFs up to 50MB)
insert into storage.buckets (id, name, public)
values ('chat-files', 'chat-files', true)
on conflict (id) do nothing;

-- Authenticated users can upload
create policy "Auth users upload chat files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'chat-files');

-- Anyone can read (public bucket)
create policy "Public read chat files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'chat-files');
