-- ============================================
-- 1. Profiles tabela (emrat e përdoruesve)
-- ============================================
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles janë publike"
  on public.profiles for select using (true);

create policy "Pronari ndryshon profilin e vet"
  on public.profiles for update using (auth.uid() = id);

-- Trigger: krijo profil automatikisht kur regjistrohet përdoruesi
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: shto profile për përdoruesit ekzistues
insert into public.profiles (id, full_name)
select id, raw_user_meta_data->>'full_name'
from auth.users
on conflict (id) do nothing;

-- ============================================
-- 2. Mesazhet tabela
-- ============================================
create table if not exists public.mesazhet (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  njoftim_id  uuid references public.njoftimet(id) on delete set null,
  content     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.mesazhet enable row level security;

create policy "Përdoruesit shohin mesazhet e veta"
  on public.mesazhet for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Përdoruesit dërgojnë mesazhe"
  on public.mesazhet for insert
  with check (auth.uid() = sender_id);

create policy "Marrësi shënon si të lexuara"
  on public.mesazhet for update
  using (auth.uid() = receiver_id);

-- ============================================
-- 3. Funksioni për listën e bisedave
-- ============================================
create or replace function public.get_conversations()
returns table (
  other_user_id   uuid,
  other_user_name text,
  last_message    text,
  last_message_time timestamptz,
  unread_count    bigint
) language sql security invoker stable as $$
  select
    case when m.sender_id = auth.uid()
         then m.receiver_id
         else m.sender_id end                               as other_user_id,
    coalesce(p.full_name, 'Përdorues')                     as other_user_name,
    (array_agg(m.content order by m.created_at desc))[1]   as last_message,
    max(m.created_at)                                      as last_message_time,
    count(*) filter (
      where m.receiver_id = auth.uid() and not m.read
    )                                                      as unread_count
  from public.mesazhet m
  left join public.profiles p on p.id = (
    case when m.sender_id = auth.uid()
         then m.receiver_id
         else m.sender_id end
  )
  where m.sender_id = auth.uid() or m.receiver_id = auth.uid()
  group by other_user_id, other_user_name
  order by last_message_time desc;
$$;
