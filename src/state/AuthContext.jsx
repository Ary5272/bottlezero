import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, isSupabaseEnabled } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseEnabled)
  const [recovering, setRecovering] = useState(false)

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signUp = useCallback(async (email, password, name) => {
    if (!isSupabaseEnabled) throw new Error('Cloud sync isn\'t set up yet.')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    return data
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseEnabled) throw new Error('Cloud sync isn\'t set up yet.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseEnabled) return
    await supabase.auth.signOut()
  }, [])

  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseEnabled) throw new Error('Cloud sync isn\'t set up yet.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (error) throw error
  }, [])

  const updatePassword = useCallback(async (password) => {
    if (!isSupabaseEnabled) throw new Error('Cloud sync isn\'t set up yet.')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    setRecovering(false)
  }, [])

  const value = useMemo(
    () => ({ user, loading, isSupabaseEnabled, recovering, signUp, signIn, signOut, resetPassword, updatePassword, dismissRecovery: () => setRecovering(false) }),
    [user, loading, recovering, signUp, signIn, signOut, resetPassword, updatePassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
