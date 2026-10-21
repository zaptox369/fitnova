create table if not exists public.fitness_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  workout jsonb,
  updated_at timestamptz not null default now()
);

-- Keep JSON objects small enough for predictable reads and writes. Apply the
-- checks separately so this script also upgrades an existing installation.
do $$ begin
  alter table public.fitness_data add constraint fitness_data_profile_object
    check (jsonb_typeof(profile) = 'object');
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.fitness_data add constraint fitness_data_workout_object
    check (workout is null or jsonb_typeof(workout) = 'object');
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.fitness_data add constraint fitness_data_profile_size
    check (pg_column_size(profile) <= 32768);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.fitness_data add constraint fitness_data_workout_size
    check (workout is null or pg_column_size(workout) <= 131072);
exception when duplicate_object then null;
end $$;

alter table public.fitness_data enable row level security;
alter table public.fitness_data force row level security;

drop policy if exists "Users can read their own fitness data" on public.fitness_data;
drop policy if exists "Users can create their own fitness data" on public.fitness_data;
drop policy if exists "Users can update their own fitness data" on public.fitness_data;

create policy "Users can read their own fitness data"
  on public.fitness_data for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own fitness data"
  on public.fitness_data for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own fitness data"
  on public.fitness_data for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.fitness_data from public, anon;
grant select, insert, update on table public.fitness_data to authenticated;

create or replace function public.set_fitness_data_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_fitness_data_updated_at on public.fitness_data;
create trigger set_fitness_data_updated_at
  before update on public.fitness_data
  for each row execute function public.set_fitness_data_updated_at();
