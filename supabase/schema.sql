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

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

create table if not exists public.fountain_ratings (
  fountain_id text not null check (fountain_id ~ '^(osm|seed)_[0-9]+$'),
  user_id uuid references auth.users on delete cascade not null,
  works boolean not null,
  would_drink boolean,
  updated_at timestamptz not null default now(),
  primary key (fountain_id, user_id),
  check (works or would_drink is null)
);

alter table public.fountain_ratings enable row level security;

drop policy if exists "ratings select own" on public.fountain_ratings;
drop policy if exists "ratings insert own" on public.fountain_ratings;
drop policy if exists "ratings update own" on public.fountain_ratings;
drop policy if exists "ratings delete own" on public.fountain_ratings;
create policy "ratings select own" on public.fountain_ratings for select using (auth.uid() = user_id);
create policy "ratings insert own" on public.fountain_ratings for insert with check (auth.uid() = user_id);
create policy "ratings update own" on public.fountain_ratings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ratings delete own" on public.fountain_ratings for delete using (auth.uid() = user_id);

create or replace function public.touch_fountain_rating()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists fountain_ratings_touch on public.fountain_ratings;
create trigger fountain_ratings_touch
  before insert or update on public.fountain_ratings
  for each row execute procedure public.touch_fountain_rating();

revoke execute on function public.touch_fountain_rating() from public, anon, authenticated;

create or replace function public.fountain_rating_summary(p_ids text[])
returns table (
  fountain_id text,
  ratings bigint,
  works_yes bigint,
  works_no bigint,
  drink_yes bigint,
  drink_no bigint,
  latest_works boolean,
  last_rated timestamptz
)
language sql
stable
security definer set search_path = public
as $$
  select
    r.fountain_id,
    count(*),
    count(*) filter (where r.works),
    count(*) filter (where not r.works),
    count(*) filter (where r.would_drink),
    count(*) filter (where r.would_drink is false),
    (array_agg(r.works order by r.updated_at desc))[1],
    max(r.updated_at)
  from public.fountain_ratings r
  where r.fountain_id = any(p_ids) and cardinality(p_ids) <= 500
  group by r.fountain_id;
$$;

revoke execute on function public.fountain_rating_summary(text[]) from public;
grant execute on function public.fountain_rating_summary(text[]) to anon, authenticated;
