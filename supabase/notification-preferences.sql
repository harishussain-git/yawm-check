create table if not exists public.notification_preferences (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  push_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

drop policy if exists "Allow notification preferences read" on public.notification_preferences;
create policy "Allow notification preferences read"
on public.notification_preferences
for select
using (true);

drop policy if exists "Allow notification preferences insert" on public.notification_preferences;
create policy "Allow notification preferences insert"
on public.notification_preferences
for insert
with check (true);

drop policy if exists "Allow notification preferences update" on public.notification_preferences;
create policy "Allow notification preferences update"
on public.notification_preferences
for update
using (true)
with check (true);
