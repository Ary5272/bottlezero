import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { save, load } from '../lib/storage'

const TourContext = createContext()
const TOUR_KEY = 'tour_completed'

const STEPS = [
  { id: 'log', title: 'Log bottles saved', desc: 'Tap here to log every reusable refill.' },
  { id: 'map', title: 'Find refill spots', desc: 'See water fountains and refill locations near you.' },
  { id: 'challenges', title: 'Compete with friends', desc: 'Create challenges and climb the leaderboard together.' },
  { id: 'profile', title: 'Track your impact', desc: 'See your stats, streaks, and badges.' },
]

export function TourProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(() => load(TOUR_KEY) === 'true')

  useEffect(() => {
    if (!hasCompleted) setIsActive(true)
  }, [hasCompleted])

  const completeTour = useCallback(() => {
    save(TOUR_KEY, 'true')
    setHasCompleted(true)
    setIsActive(false)
    setCurrentStep(0)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      completeTour()
    }
  }, [currentStep, completeTour])

  const prevStep = useCallback(() => {
    setCurrentStep(s => Math.max(0, s - 1))
  }, [])

  const skipTour = useCallback(() => {
    completeTour()
  }, [completeTour])

  const replayTour = useCallback(() => {
    setCurrentStep(0)
    setIsActive(true)
  }, [])

  const value = useMemo(() => ({
    isActive,
    currentStep,
    steps: STEPS,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    replayTour,
    hasCompleted,
  }), [isActive, currentStep, nextStep, prevStep, skipTour, completeTour, replayTour, hasCompleted])

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}

export function useTour() {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTour must be inside TourProvider')
  return ctx
}
