import { supabase, isSupabaseEnabled } from './supabase'

const RATEABLE_TYPES = ['fountain', 'refill_station']
const RATEABLE_ID = /^(osm|seed)_[0-9]+$/

export function isRateable(loc) {
  return RATEABLE_TYPES.includes(loc.type) && RATEABLE_ID.test(loc.id)
}

export function summarize(row) {
  const count = Number(row?.ratings) || 0
  if (!count) return { status: 'unrated', label: 'No ratings yet', count: 0, lastRated: null }
  const lastRated = row.last_rated ? new Date(row.last_rated) : null
  if (row.latest_works === false) return { status: 'broken', label: 'Reported broken', count, lastRated }
  const yes = Number(row.drink_yes) || 0
  const no = Number(row.drink_no) || 0
  if (yes + no === 0) return { status: 'works', label: 'Works', count, lastRated }
  if (no > yes) return { status: 'gross', label: "Works, but most say it's gross", count, lastRated }
  return { status: 'good', label: `Works · ${yes} of ${yes + no} would drink from it`, count, lastRated }
}

export async function fetchSummaries(ids) {
  if (!isSupabaseEnabled || ids.length === 0) return {}
  const { data, error } = await supabase.rpc('fountain_rating_summary', { p_ids: ids.slice(0, 500) })
  if (error || !data) return {}
  return Object.fromEntries(data.map(row => [row.fountain_id, row]))
}

export async function fetchMyRatings(userId) {
  if (!isSupabaseEnabled || !userId) return {}
  const { data, error } = await supabase
    .from('fountain_ratings')
    .select('fountain_id, works, would_drink')
    .eq('user_id', userId)
  if (error || !data) return {}
  return Object.fromEntries(data.map(row => [row.fountain_id, { works: row.works, wouldDrink: row.would_drink }]))
}

export async function saveRating(userId, fountainId, { works, wouldDrink }) {
  const { error } = await supabase
    .from('fountain_ratings')
    .upsert(
      { fountain_id: fountainId, user_id: userId, works, would_drink: works ? wouldDrink ?? null : null },
      { onConflict: 'fountain_id,user_id' }
    )
  if (error) throw error
}
