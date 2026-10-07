import { weekdays } from '../data/demo'

/** ['tue','wed','thu'] -> 'Tue · Wed · Thu' */
export const formatDayList = (ids = [], days = weekdays) => {
  const order = days.map((day) => day.id)
  const sorted = [...ids].sort((a, b) => order.indexOf(a) - order.indexOf(b))
  return sorted
    .map((id) => days.find((day) => day.id === id)?.short)
    .filter(Boolean)
    .map((short) => short.charAt(0) + short.slice(1).toLowerCase())
    .join(' · ')
}

export const weekSummary = (ids = []) => {
  if (ids.length === 5) return 'Every weekday'
  if (ids.length === 0) return 'No office days yet'
  return `${ids.length} office days / week`
}
