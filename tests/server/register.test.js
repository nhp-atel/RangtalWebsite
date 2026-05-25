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
    expect(res.body.batch).toBe('july')
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

  it('rejects a too-short name with 400', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, fullName: 'A' })
    expect(res.status).toBe(400)
  })

  it('rejects a too-short phone with 400', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, phone: '123' })
    expect(res.status).toBe(400)
  })

  it('ignores a client-sent amount and stores the server price', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, amount: 999 })
    expect(res.status).toBe(201)
    const row = db.prepare('SELECT amount FROM registrations WHERE ref = ?').get(res.body.ref)
    expect(row.amount).toBe(60)
  })

  it('stores a guardian name for minors when provided', async () => {
    const res = await request(app).post('/api/register').send({ ...valid, ageGroup: '13—17', guardian: 'Meera Patel' })
    expect(res.status).toBe(201)
    const row = db.prepare('SELECT guardian, age_group FROM registrations WHERE ref = ?').get(res.body.ref)
    expect(row.guardian).toBe('Meera Patel')
    expect(row.age_group).toBe('13—17')
  })
})
