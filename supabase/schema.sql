create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  daily_goal int default 5,
  created_at timestamptz default now()
);

create table if not exists public.bottle_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  count int default 1,
  source text default 'other',
  created_at timestamptz default now()
);

create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique not null,
  goal int not null default 100,
  created_by uuid references auth.users on delete cascade,
  start_date timestamptz default now(),
  end_date timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.challenge_members (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references public.challenges on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  joined_at timestamptz default now(),
  unique(challenge_id, user_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.bottle_logs enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_members enable row level security;

create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "own logs select" on public.bottle_logs for select using (auth.uid() = user_id);
create policy "own logs insert" on public.bottle_logs for insert with check (auth.uid() = user_id);
create policy "own logs delete" on public.bottle_logs for delete using (auth.uid() = user_id);

create policy "challenges select" on public.challenges for select using (auth.role() = 'authenticated');
create policy "challenges insert" on public.challenges for insert with check (auth.uid() = created_by);
create policy "challenges delete own" on public.challenges for delete using (auth.uid() = created_by);

create policy "members select own" on public.challenge_members for select using (auth.uid() = user_id);
create policy "members insert own" on public.challenge_members for insert with check (auth.uid() = user_id);
create policy "members delete own" on public.challenge_members for delete using (auth.uid() = user_id);

create or replace function public.get_challenge_leaderboard(p_code text)
returns table (name text, bottles bigint)
language plpgsql
security definer set search_path = public
as $$
declare
  v_challenge public.challenges;
begin
  select * into v_challenge from public.challenges where code = p_code;
  if v_challenge is null then
    raise exception 'Challenge not found';
  end if;

  if not exists (
    select 1 from public.challenge_members
    where challenge_id = v_challenge.id and user_id = auth.uid()
  ) then
    raise exception 'Not a member of this challenge';
  end if;

  return query
    select
      coalesce(p.name, 'Anonymous') as name,
      coalesce(sum(bl.count), 0)::bigint as bottles
    from public.challenge_members cm
    join public.profiles p on p.id = cm.user_id
    left join public.bottle_logs bl
      on bl.user_id = cm.user_id
      and bl.created_at >= v_challenge.start_date
      and (v_challenge.end_date is null or bl.created_at <= v_challenge.end_date)
    where cm.challenge_id = v_challenge.id
    group by p.name
    order by bottles desc;
end;
$$;

revoke execute on function public.get_challenge_leaderboard(text) from public, anon;
grant execute on function public.get_challenge_leaderboard(text) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
