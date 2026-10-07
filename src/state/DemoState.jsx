import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { customer, defaultDays, journeyStages } from '../data/demo'

/** The demo clock. Today is Tuesday 24 September; tomorrow is Wednesday. */
export const TODAY = { weekday: 'tue', label: 'TUE · 24 SEP', tomorrow: 'wed', tomorrowLabel: 'Wednesday' }

const DemoContext = createContext(null)

export function DemoProvider({ children }) {
  const [home, setHome] = useState(customer.home.full)
  const [office, setOffice] = useState(customer.office.full)
  const [days, setDays] = useState(defaultDays)
  const [connected, setConnected] = useState(false)
  const [pausedDays, setPausedDays] = useState([])
  /** Which of the three demo moments the Today screen is sitting at. */
  const [journeyStage, setJourneyStage] = useState(0)

  const toggleDay = useCallback((id) => {
    setDays((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
  }, [])

  const setAllDays = useCallback(() => setDays(['mon', 'tue', 'wed', 'thu', 'fri']), [])

  const advanceJourney = useCallback(
    () => setJourneyStage((prev) => Math.min(prev + 1, journeyStages.length - 1)),
    [],
  )

  const resetJourney = useCallback(() => setJourneyStage(0), [])

  const togglePause = useCallback((id) => {
    setPausedDays((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
  }, [])

  const value = useMemo(
    () => ({
      home,
      office,
      setHome,
      setOffice,
      days,
      setDays,
      toggleDay,
      setAllDays,
      connected,
      setConnected,
      pausedDays,
      togglePause,
      isPaused: (id) => pausedDays.includes(id),
      journeyStage,
      advanceJourney,
      resetJourney,
    }),
    [
      home,
      office,
      days,
      toggleDay,
      setAllDays,
      connected,
      pausedDays,
      togglePause,
      journeyStage,
      advanceJourney,
      resetJourney,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo must be used inside DemoProvider')
  return context
}
