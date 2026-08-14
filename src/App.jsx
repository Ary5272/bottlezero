import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import NavBar from './components/NavBar'
import TopBar from './components/TopBar'
import Celebrations from './components/Celebrations'
import HabitReminders from './components/HabitReminders'
import InstallModal from './components/InstallModal'
import RecoveryModal from './components/RecoveryModal'
import ErrorBoundary from './components/ErrorBoundary'
import Onboarding, { needsOnboarding } from './components/Onboarding'
import Icon from './components/Icon'
import Dashboard from './routes/Dashboard'
import { routeImporters, prefetchAll } from './lib/prefetch'
import { isStandalone } from './lib/pwa'
import { load, save } from './lib/storage'

const Map = lazy(routeImporters['/map'])
const Rewards = lazy(routeImporters['/rewards'])
const Insights = lazy(routeImporters['/insights'])
const Learn = lazy(routeImporters['/learn'])
const Profile = lazy(routeImporters['/profile'])
const About = lazy(routeImporters['/about'])
const Privacy = lazy(routeImporters['/privacy'])
const Challenges = lazy(routeImporters['/challenges'])
const Auth = lazy(routeImporters['/auth'])

function Fallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <span className="w-6 h-6 rounded-full border-2 border-line border-t-accent animate-spin" />
    </div>
  )
}

function NotFound() {
  return (
    <div className="max-w-sm mx-auto px-6 py-20 flex flex-col items-center text-center gap-4">
      <span className="grid place-items-center w-14 h-14 rounded-2xl bg-accent-soft text-accent">
        <Icon name="map" size={28} stroke={1.9} />
      </span>
      <div>
        <h1 className="text-xl font-bold text-ink">Page not found</h1>
        <p className="text-sm text-muted mt-1">That page doesn't exist. Let's get you back on track.</p>
      </div>
      <Link to="/" className="bg-accent text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-accent-dark active:scale-[0.99]">
        Back home
      </Link>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const chromeless = pathname === '/auth'
  const publicRoute = pathname === '/privacy'
  const [onboarding, setOnboarding] = useState(needsOnboarding())
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200))
    const cic = window.cancelIdleCallback || clearTimeout
    const id = ric(() => prefetchAll())
    return () => cic(id)
  }, [])

  useEffect(() => {
    const main = document.querySelector('main')
    if (main) main.scrollTo({ top: 0 })
  }, [pathname])

  function finishOnboarding() {
    setOnboarding(false)
    if (!isStandalone() && !load('install_prompted', false)) setShowInstall(true)
  }

  function closeInstall() {
    save('install_prompted', true)
    setShowInstall(false)
  }

  if (onboarding && !publicRoute) return <Onboarding onDone={finishOnboarding} />

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300] focus:bg-accent focus:text-white focus:px-3 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>
      {!chromeless && <TopBar />}
      <main id="main" className="flex-1 overflow-y-auto">
        <ErrorBoundary key={pathname}>
          <div className="page-fade">
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<Map />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </ErrorBoundary>
      </main>
      {!chromeless && <NavBar />}
      {!chromeless && <Celebrations />}
      {!chromeless && <HabitReminders />}
      {showInstall && <InstallModal onClose={closeInstall} />}
      <RecoveryModal />
    </>
  )
}
