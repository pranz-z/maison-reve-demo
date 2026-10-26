/**
 * Money is stored as integer US cents everywhere. The Manila studio prices in
 * pesos, so display converts at a fixed rate and every input converts back —
 * the schema, tests and booking maths stay in cents.
 *
 * Change USD_TO_PHP to re-price the whole studio without touching a row.
 */

export const CURRENCY = 'PHP'
export const USD_TO_PHP = 56

export function formatMoney(cents: number, options: { cents?: boolean; signed?: boolean } = {}): string {
  const pesos = (cents / 100) * USD_TO_PHP
  const showCents = options.cents ?? Math.round(pesos * 100) % 100 !== 0
  const formatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(Math.abs(pesos))
  if (pesos < 0) return `−${formatted}`
  return options.signed && pesos > 0 ? `+${formatted}` : formatted
}

/** Compact form for dense admin tables: ₱1.0M · ₱18k */
export function formatMoneyCompact(cents: number): string {
  const pesos = (cents / 100) * USD_TO_PHP
  if (Math.abs(pesos) >= 10_000) {
    return `₱${new Intl.NumberFormat('en-PH', { notation: 'compact', maximumFractionDigits: 1 }).format(pesos)}`
  }
  return formatMoney(cents)
}

export function parseMoneyToCents(input: string): number | null {
  const cleaned = input.replace(/[^0-9.\-]/g, '')
  if (!cleaned) return null
  const value = Number.parseFloat(cleaned)
  if (Number.isNaN(value)) return null
  return Math.round((value / USD_TO_PHP) * 100)
}

export function centsFromDollars(dollars: number): number {
  return Math.round(dollars * 100)
}

export function percentOf(value: number, percent: number): number {
  return Math.round((value * percent) / 100)
}

export function percent(part: number, whole: number): number {
  if (!whole) return 0
  return Math.round((part / whole) * 100)
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`
}
