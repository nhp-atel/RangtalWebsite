import { Router } from 'express'
import crypto from 'node:crypto'
import { requireAuth } from '../middleware/auth.js'
import { toCsv } from '../lib/csv.js'

function safeEqual(a, b) {
  const ab = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  // Length mismatch can't go through timingSafeEqual (it throws on unequal
  // lengths). This leaks only the password's byte-length, which is an
  // acceptable trade-off for this internal shared-password tool.
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

function buildFilter(q) {
  const where = []
  const params = {}
  if (q.batch) { where.push('batch = @batch'); params.batch = q.batch }
  // Only the exact strings 'true'/'false' filter by paid status; any other
  // value means "no paid filter" (returns both paid and unpaid).
  const paid = typeof q.paid === 'string' ? q.paid.toLowerCase() : q.paid
  if (paid === 'true') where.push('paid = 1')
  if (paid === 'false') where.push('paid = 0')
  if (q.q) { where.push('(full_name LIKE @like OR email LIKE @like)'); params.like = '%' + q.q + '%' }
  return { clause: where.length ? 'WHERE ' + where.join(' AND ') : '', params }
}

function fetchRows(db, query) {
  const { clause, params } = buildFilter(query)
  return db.prepare(`SELECT * FROM registrations ${clause} ORDER BY created_at DESC`).all(params)
}

export function adminRouter(db, { adminPassword } = {}) {
  const router = Router()

  router.post('/login', (req, res) => {
    const password = (req.body && req.body.password) || ''
    if (!adminPassword || !safeEqual(password, adminPassword)) {
      return res.status(401).json({ error: 'Incorrect password.' })
    }
    req.session.admin = true
    return res.json({ ok: true })
  })

  router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ ok: true }))
  })

  router.get('/registrations', requireAuth, (req, res) => {
    const rows = fetchRows(db, req.query)
    const counts = {
      total: db.prepare('SELECT COUNT(*) n FROM registrations').get().n,
      paid: db.prepare('SELECT COUNT(*) n FROM registrations WHERE paid = 1').get().n,
      unpaid: db.prepare('SELECT COUNT(*) n FROM registrations WHERE paid = 0').get().n,
      byBatch: db.prepare('SELECT batch, COUNT(*) n FROM registrations GROUP BY batch').all()
        .reduce((acc, r) => { acc[r.batch] = r.n; return acc }, {}),
    }
    res.json({ rows, counts })
  })

  router.patch('/registrations/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id)
    const paid = !!(req.body && req.body.paid === true)
    const exists = db.prepare('SELECT id FROM registrations WHERE id = ?').get(id)
    if (!exists) return res.status(404).json({ error: 'Not found.' })
    db.prepare('UPDATE registrations SET paid = ?, paid_at = ? WHERE id = ?')
      .run(paid ? 1 : 0, paid ? new Date().toISOString() : null, id)
    res.json(db.prepare('SELECT * FROM registrations WHERE id = ?').get(id))
  })

  router.get('/export.csv', requireAuth, (req, res) => {
    const rows = fetchRows(db, req.query)
    const columns = [
      { key: 'ref', label: 'Ref' },
      { key: 'full_name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'age_group', label: 'Age' },
      { key: 'batch', label: 'Batch' },
      { key: 'level', label: 'Level' },
      { key: 'emergency', label: 'Emergency' },
      { key: 'guardian', label: 'Guardian' },
      { key: 'notes', label: 'Notes' },
      { key: 'amount', label: 'Amount' },
      { key: 'paid', label: 'Paid' },
      { key: 'paid_at', label: 'Paid At' },
      { key: 'created_at', label: 'Registered' },
    ]
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="rangtaal-registrations.csv"')
    res.send(toCsv(rows, columns))
  })

  return router
}
