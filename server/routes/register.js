import { Router } from 'express'
import { BATCHES, isValidBatch } from '../lib/batches.js'
import { generateRef } from '../lib/ref.js'

export function registerRouter(db) {
  const router = Router()

  const insert = db.prepare(`
    INSERT INTO registrations
      (ref, full_name, email, phone, age_group, batch, level, emergency, guardian, notes, amount, agreed, paid, paid_at, created_at)
    VALUES
      (@ref, @full_name, @email, @phone, @age_group, @batch, @level, @emergency, @guardian, @notes, @amount, @agreed, 0, NULL, @created_at)
  `)

  router.post('/register', (req, res) => {
    const b = req.body || {}

    // Honeypot: a real user never fills this hidden field.
    if (b.hp) return res.status(200).json({ ref: null })

    const fullName = String(b.fullName || '').trim()
    const email = String(b.email || '').trim()
    const phone = String(b.phone || '').trim()

    if (fullName.length < 2) return res.status(400).json({ error: 'Please enter your full name.' })
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ error: 'Please enter a valid email.' })
    if (phone.replace(/\D/g, '').length < 8) return res.status(400).json({ error: 'Please enter a valid phone number.' })
    if (!isValidBatch(b.batch)) return res.status(400).json({ error: 'Please choose a valid batch.' })
    if (b.agreed !== true) return res.status(400).json({ error: 'You must accept the code of conduct.' })

    const amount = BATCHES[b.batch].price

    for (let attempt = 0; attempt < 5; attempt++) {
      const ref = generateRef()
      try {
        insert.run({
          ref,
          full_name: fullName,
          email,
          phone,
          age_group: b.ageGroup || null,
          batch: b.batch,
          level: b.level || null,
          emergency: b.emergency || null,
          guardian: b.guardian || null,
          notes: b.notes || null,
          amount,
          agreed: 1,
          created_at: new Date().toISOString(),
        })
        return res.status(201).json({ ref, batch: b.batch })
      } catch (e) {
        // A duplicate ref is the only retryable error: generate a new one.
        if (e && e.code === 'SQLITE_CONSTRAINT_UNIQUE') continue
        return res.status(500).json({ error: 'Could not save your registration. Please try again.' })
      }
    }
    // All retries collided (astronomically unlikely): give up cleanly.
    return res.status(500).json({ error: 'Could not save your registration. Please try again.' })
  })

  return router
}
