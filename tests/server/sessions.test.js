import { describe, it, expect } from 'vitest'
import { JULY_TUESDAYS, isValidSessionDate } from '../../server/lib/sessions.js'

describe('sessions', () => {
  it('lists the four July 2026 Tuesdays', () => {
    expect(JULY_TUESDAYS).toEqual(['2026-07-07', '2026-07-14', '2026-07-21', '2026-07-28'])
  })
  it('validates session dates', () => {
    expect(isValidSessionDate('2026-07-14')).toBe(true)
    expect(isValidSessionDate('2026-07-15')).toBe(false)
    expect(isValidSessionDate('')).toBe(false)
    expect(isValidSessionDate(undefined)).toBe(false)
  })
})
