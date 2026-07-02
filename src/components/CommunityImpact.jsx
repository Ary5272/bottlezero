import { useEffect, useState } from 'react'
import { supabase, isSupabaseEnabled } from '../lib/supabase'
import { load, save } from '../lib/storage'
import AnimatedNumber from './AnimatedNumber'
import Icon from './Icon'

export default function CommunityImpact() {
  const [stats, setStats] = useState(() => load('community', null))

  useEffect(() => {
    if (!isSupabaseEnabled) return
    let cancelled = false
    supabase.rpc('community_stats').then(({ data, error }) => {
      if (cancelled || error || !data?.total_bottles) return
      setStats(data)
      save('community', data)
    })
    return () => { cancelled = true }
  }, [])

  if (!stats?.total_bottles) return null

  return (
    <section className="flex items-center gap-3 bg-accent-soft border border-accent/20 rounded-2xl px-4 py-3.5">
      <span className="grid place-items-center w-9 h-9 rounded-full bg-accent text-white shrink-0">
        <Icon name="users" size={18} stroke={2.2} />
      </span>
      <p className="text-[13px] text-ink leading-snug">
        Together, the BottleZero community has avoided{' '}
        <strong className="font-bold tabular-nums">
          <AnimatedNumber value={stats.total_bottles} decimals={0} />
        </strong>{' '}
        single-use bottles
        {stats.total_users > 1 && (
          <span className="text-muted"> across {stats.total_users.toLocaleString()} members</span>
        )}
        .
      </p>
    </section>
  )
}
