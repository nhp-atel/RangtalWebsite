import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { isValidBatch } from '../lib/batches.js'
import { JULY_TUESDAYS, isValidSessionDate } from '../lib/sessions.js'

export function attendanceRouter(db) {
  const router = Router()

  const insert = db.prepare(
    'INSERT OR IGNORE INTO attendance (registration_id, date, created_at) VALUES (?, ?, ?)'
  )
  const del = db.prepare('DELETE FROM attendance WHERE registration_id = ? AND date = ?')

  // GET /api/admin/attendance?batch=july
  router.get('/', requireAuth, (req, res) => {
    const batch = req.query.batch || 'july'
    if (!isValidBatch(batch)) return res.status(400).json({ error: 'Unknown batch.' })
    // Attendance is only configured for July today (dates live in sessions.js).
    if (batch !== 'july') return res.status(400).json({ error: 'Attendance is only set up for July.' })

    const candidates = db
      .prepare('SELECT id, full_name FROM registrations WHERE batch = ? ORDER BY full_name COLLATE NOCASE')
      .all(batch)

    let present = []
    if (candidates.length) {
      const placeholders = candidates.map(() => '?').join(',')
      present = db
        .prepare(`SELECT registration_id, date FROM attendance WHERE registration_id IN (${placeholders})`)
        .all(...candidates.map((c) => c.id))
    }

    res.json({ dates: JULY_TUESDAYS, candidates, present })
  })

  // PUT /api/admin/attendance  { registrationId, date, present }
  router.put('/', requireAuth, (req, res) => {
    const { registrationId, date, present } = req.body || {}
    if (!isValidSessionDate(date)) return res.status(400).json({ error: 'Not a valid session date.' })

    const reg = db.prepare('SELECT id, batch FROM registrations WHERE id = ?').get(Number(registrationId))
    if (!reg) return res.status(404).json({ error: 'Registrant not found.' })
    if (reg.batch !== 'july') return res.status(400).json({ error: 'Registrant is not in the July batch.' })

    if (present === true) {
      insert.run(reg.id, date, new Date().toISOString())
    } else {
      del.run(reg.id, date)
    }
    res.json({ ok: true })
  })

  return router
}
