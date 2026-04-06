create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  rating integer check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Allow anyone (including anonymous visitors) to insert feedback
alter table feedback enable row level security;

create policy "Anyone can submit feedback"
  on feedback for insert
  to anon, authenticated
  with check (true);
