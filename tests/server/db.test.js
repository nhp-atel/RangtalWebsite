import { describe, it, expect } from 'vitest'
import { createDb } from '../../server/db.js'

describe('createDb', () => {
  it('creates the registrations table with expected columns', () => {
    const db = createDb(':memory:')
    const cols = db.prepare('PRAGMA table_info(registrations)').all().map((c) => c.name)
    for (const name of [
      'id', 'ref', 'full_name', 'email', 'phone', 'age_group', 'batch',
      'level', 'emergency', 'notes', 'amount', 'agreed', 'paid', 'paid_at', 'created_at',
    ]) {
      expect(cols).toContain(name)
    }
    db.close()
  })

  it('enforces a unique ref', () => {
    const db = createDb(':memory:')
    const ins = db.prepare(
      `INSERT INTO registrations (ref, full_name, email, phone, batch, amount, agreed, created_at)
       VALUES (?, 'A', 'a@b.com', '12345678', 'july', 60, 1, '2026-05-25T00:00:00Z')`
    )
    ins.run('RT-11111')
    expect(() => ins.run('RT-11111')).toThrow()
    db.close()
  })
})
