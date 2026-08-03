create policy "challenges delete own" on public.challenges
  for delete using (auth.uid() = created_by);
