-- Tabela e njoftimeve (anunce/listings)
create table if not exists public.njoftimet (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  category    text not null,
  description text not null,
  price       numeric(10, 2) not null default 0,
  city        text not null,
  created_at  timestamptz not null default now()
);

-- RLS (Row Level Security)
alter table public.njoftimet enable row level security;

-- Të gjithë mund të lexojnë njoftimet
create policy "Njoftimet janë publike"
  on public.njoftimet for select
  using (true);

-- Vetëm pronari mund të shtojë/ndryshojë/fshijë njoftimet e veta
create policy "Pronari shton njoftimet"
  on public.njoftimet for insert
  with check (auth.uid() = user_id);

create policy "Pronari ndryshon njoftimet e veta"
  on public.njoftimet for update
  using (auth.uid() = user_id);

create policy "Pronari fshin njoftimet e veta"
  on public.njoftimet for delete
  using (auth.uid() = user_id);
