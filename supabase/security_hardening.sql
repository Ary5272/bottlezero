revoke execute on function public.get_challenge_leaderboard(text) from public, anon;
grant execute on function public.get_challenge_leaderboard(text) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
