import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createDb } from '../../server/db.js'
import { createApp } from '../../server/app.js'

function makeApp() {
  const db = createDb(':memory:')
  const app = createApp(db, { adminPassword: 'test-pass', sessionSecret: 'test-secret' })
  return { app, db }
}

const valid = {
  fullName: 'Ankita Patel',
  email: 'ankita@example.com',
  phone: '6305550142',
  ageGroup: '18—25',
  batch: 'july',
  level: 'social',
  emergency: 'Priya 6305550000',
  notes: 'none',
  agreed: true,
}

describe('POST /api/register', () => {
  let app, db
  beforeEach(() => { ({ app, db } = makeApp()) })

  it('saves a valid registration and returns a ref', async () => {
    const res = await request(app).post('/api/register').send(valid)
    expect(res.status).toBe(201)
    expect(res.body.ref).toMatch(/^RT-\d{5}$/)
    const row = db.prepare('SELECT * FROM registrations WHERE ref = ?').get(res.body.ref)
    expect(row.full_name).toBe('Ankita Patel')
    expect(row.amount).toBe(60)   // derived server-side
    expect(row.paid).toBe(0)
    expect(row.agreed).toBe(1)
  })

  it('rejects a missing email with 400', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, email: '' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  it('rejects an unknown batch with 400', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, batch: 'december' })
    expect(res.status).toBe(400)
  })

  it('rejects when conduct not agreed', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, agreed: false })
    expect(res.status).toBe(400)
  })

  it('silently drops honeypot submissions without saving', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, hp: 'bot' })
    expect(res.status).toBe(200)
    expect(db.prepare('SELECT COUNT(*) n FROM registrations').get().n).toBe(0)
  })
})
