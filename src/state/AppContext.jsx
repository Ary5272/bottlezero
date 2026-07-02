import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { load, save } from '../lib/storage'
import { checkBadges } from '../lib/badges'
import { calcImpact } from '../lib/impact'
import { getRewards, getPerkState } from '../lib/rewards'
import { calcStreak, countDaysGoalMet } from '../lib/streak'
import { supabase, isSupabaseEnabled } from '../lib/supabase'
import { localDay } from '../lib/date'
import { useAuth } from './AuthContext'

const AppContext = createContext()

const DEFAULT_PROFILE = {
  name: '',
  dailyGoal: 5,
  createdAt: new Date().toISOString(),
}

function getToday() {
  return localDay()
}

function mapRow(r) {
  return { id: r.id, count: r.count, timestamp: r.created_at, source: r.source }
}

async function fetchAllLogs(userId) {
  const all = []
  const size = 1000
  for (let from = 0; ; from += size) {
    const { data, error } = await supabase
      .from('bottle_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .range(from, from + size - 1)
    if (error || !data || data.length === 0) break
    all.push(...data)
    if (data.length < size) break
  }
  return all
}

export function AppProvider({ children }) {
  const { user } = useAuth()
  const cloud = isSupabaseEnabled && !!user

  const [profile, setProfile] = useState(() => load('profile', { ...DEFAULT_PROFILE }))
  const [logs, setLogs] = useState(() => load('logs', []))
  const [syncing, setSyncing] = useState(false)
  const pendingCancel = useRef(new Set())

  useEffect(() => { save('profile', profile) }, [profile])
  useEffect(() => { save('logs', logs) }, [logs])

  useEffect(() => {
    let cancelled = false

    if (!cloud) {
      setProfile(load('profile', { ...DEFAULT_PROFILE }))
      setLogs(load('logs', []))
      return
    }

    setSyncing(true)
    ;(async () => {
      const [{ data: prof }, logRows] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        fetchAllLogs(user.id),
      ])
      if (cancelled) return
      if (prof) {
        setProfile({
          name: prof.name || '',
          dailyGoal: prof.daily_goal || 5,
          createdAt: prof.created_at || new Date().toISOString(),
        })
      }
      const cloudLogs = (logRows || []).map(mapRow)
      const unsynced = (load('logs', []) || []).filter(l => l && l.unsynced)
      setLogs([...cloudLogs, ...unsynced])
      setSyncing(false)

      for (const u of unsynced) {
        const { data, error } = await supabase
          .from('bottle_logs')
          .insert({ user_id: user.id, count: u.count, source: u.source })
          .select()
          .single()
        if (!error && data && !cancelled) {
          setLogs(prev => prev.map(l => (l.id === u.id ? mapRow(data) : l)))
        }
      }
    })()

    return () => { cancelled = true }
  }, [cloud, user?.id])

  async function logBottle(count = 1, source = 'other') {
    const tempId = crypto.randomUUID()
    setLogs(prev => [...prev, {
      id: tempId,
      count,
      timestamp: new Date().toISOString(),
      source,
      _temp: cloud,
    }])

    if (cloud) {
      const { data, error } = await supabase
        .from('bottle_logs')
        .insert({ user_id: user.id, count, source })
        .select()
        .single()
      if (error) {
        setLogs(prev => prev.map(l => (l.id === tempId ? { ...l, _temp: false, unsynced: true } : l)))
      } else if (pendingCancel.current.has(tempId)) {
        pendingCancel.current.delete(tempId)
        await supabase.from('bottle_logs').delete().eq('id', data.id)
      } else {
        setLogs(prev => prev.map(l => (l.id === tempId ? { ...l, _temp: false, serverId: data.id } : l)))
      }
    }
    return tempId
  }

  async function removeLog(id) {
    let target
    setLogs(prev => {
      target = prev.find(l => l.id === id)
      return prev.filter(l => l.id !== id)
    })
    if (cloud && target) {
      if (target._temp) pendingCancel.current.add(id)
      else await supabase.from('bottle_logs').delete().eq('id', target.serverId || target.id)
    }
  }

  async function updateProfile(payload) {
    setProfile(prev => ({ ...prev, ...payload }))
    if (cloud) {
      const update = {}
      if ('name' in payload) update.name = payload.name
      if ('dailyGoal' in payload) update.daily_goal = payload.dailyGoal
      await supabase.from('profiles').update(update).eq('id', user.id)
    }
  }

  async function resetData() {
    if (cloud) {
      await supabase.from('bottle_logs').delete().eq('user_id', user.id)
      setLogs([])
    } else {
      setLogs([])
      setProfile({ ...DEFAULT_PROFILE })
      save('logs', [])
      save('profile', { ...DEFAULT_PROFILE })
    }
  }

  const derived = useMemo(() => {
    const totalBottles = logs.reduce((sum, l) => sum + (l.count || 1), 0)
    const todayCount = logs
      .filter(l => localDay(l.timestamp) === getToday())
      .reduce((sum, l) => sum + (l.count || 1), 0)
    const streak = calcStreak(logs)
    const daysGoalMet = countDaysGoalMet(logs, profile.dailyGoal)
    const badges = checkBadges(totalBottles, streak.current, daysGoalMet)
    const impact = calcImpact(totalBottles)
    const rewards = getRewards(totalBottles, badges.filter(b => b.unlocked).length, daysGoalMet)
    const perks = getPerkState(rewards.level.levelNumber)
    return { totalBottles, todayCount, streak, daysGoalMet, badges, impact, rewards, perks }
  }, [logs, profile.dailyGoal])

  return (
    <AppContext.Provider value={{
      profile, logs, ...derived,
      cloud, syncing,
      logBottle, removeLog, updateProfile, resetData,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
