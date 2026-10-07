import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Welcome from './screens/Welcome'
import CheckRoute from './screens/CheckRoute'
import Match from './screens/Match'
import Days from './screens/Days'
import Plan from './screens/Plan'
import Journey from './screens/Journey'
import HowItWorks from './screens/HowItWorks'
import Schedule from './screens/Schedule'
import Profile from './screens/Profile'
import Dabbawala from './screens/Dabbawala'
import ScreenWipe from './components/ScreenWipe'

/* The landing experience carries the whole WebGL bundle, so it is the one
   route that is code-split. The product screens stay eagerly bundled. */
const Landing = lazy(() => import('./landing/Landing'))

const TITLES = {
  '/': "SETU — Mumbai's Dabba Connection",
  '/app': "SETU — Mumbai's Dabba Connection",
  '/route': 'Check your route · SETU',
  '/match': 'Your carrier · SETU',
  '/days': 'Office days · SETU',
  '/plan': 'Your monthly plan · SETU',
  '/journey': 'Today · SETU',
  '/how-it-works': 'How tracking works · SETU',
  '/schedule': 'Schedule · SETU',
  '/profile': 'Profile · SETU',
  '/dabbawala': 'आजचे डबे · SETU',
}

function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.title = TITLES[pathname] ?? "SETU — Mumbai's Dabba Connection"
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <ScreenWipe />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Landing />
            </Suspense>
          }
        />
        <Route path="/app" element={<Welcome />} />
        <Route path="/route" element={<CheckRoute />} />
        <Route path="/match" element={<Match />} />
        <Route path="/days" element={<Days />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dabbawala" element={<Dabbawala />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
