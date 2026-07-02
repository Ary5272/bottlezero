create or replace function public.community_stats()
returns json
language sql
stable
security definer set search_path = public
as $$
  select json_build_object(
    'total_bottles', coalesce(sum(count), 0),
    'total_users', count(distinct user_id)
  )
  from public.bottle_logs;
$$;

revoke all on function public.community_stats() from public;
grant execute on function public.community_stats() to anon, authenticated;
