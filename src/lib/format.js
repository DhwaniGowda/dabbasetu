/** ₹ formatting for the whole prototype. Indian grouping, no decimals. */
const inrFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const inr = (value) => inrFormat.format(value)

export const perLunch = (daysPerWeek) => {
  if (!daysPerWeek) return null
  const lunches = Math.round(daysPerWeek * 4.33)
  return { lunches, each: Math.round(1800 / lunches) }
}
