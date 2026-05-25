import { describe, it, expect } from 'vitest'
import { BATCHES, isValidBatch } from '../../server/lib/batches.js'
import { generateRef } from '../../server/lib/ref.js'
import { toCsv } from '../../server/lib/csv.js'

describe('batches', () => {
  it('knows july and august at $60', () => {
    expect(BATCHES.july.price).toBe(60)
    expect(BATCHES.august.price).toBe(60)
  })
  it('validates batch ids', () => {
    expect(isValidBatch('july')).toBe(true)
    expect(isValidBatch('nope')).toBe(false)
    expect(isValidBatch(undefined)).toBe(false)
  })
})

describe('generateRef', () => {
  it('produces RT-##### codes', () => {
    expect(generateRef()).toMatch(/^RT-\d{5}$/)
  })
})

describe('toCsv', () => {
  it('serializes rows with a header and escapes commas/quotes', () => {
    const cols = [
      { key: 'name', label: 'Name' },
      { key: 'note', label: 'Note' },
    ]
    const csv = toCsv([{ name: 'Ann', note: 'a, "b"' }], cols)
    expect(csv).toBe('Name,Note\nAnn,"a, ""b"""\n')
  })
})
