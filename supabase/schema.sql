create table if not exists public.fitness_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb check (jsonb_typeof(profile) = 'object'),
  workout jsonb,
  updated_at timestamptz not null default now(),
  constraint fitness_data_workout_object check (workout is null or jsonb_typeof(workout) = 'object')
);

-- Apply the data-shape checks as well when upgrading a table created by an older schema.
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

alter table public.fitness_data enable row level security;

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

grant select, insert, update on public.fitness_data to authenticated;
revoke all on public.fitness_data from anon;

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
