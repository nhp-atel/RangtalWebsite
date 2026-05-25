import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createDb } from '../../server/db.js'
import { createApp } from '../../server/app.js'

function makeApp() {
  const db = createDb(':memory:')
  const app = createApp(db, { adminPassword: 'test-pass', sessionSecret: 'test-secret' })
  return { app, db }
}

const reg = (over = {}) => ({
  fullName: 'Ann Lee', email: 'ann@example.com', phone: '6305550142',
  ageGroup: '18—25', batch: 'july', level: 'social', emergency: 'x', notes: '',
  agreed: true, ...over,
})

describe('attendance API', () => {
  let app, db, agent
  beforeEach(async () => {
    ;({ app, db } = makeApp())
    agent = request.agent(app)
    await agent.post('/api/register').send(reg({ fullName: 'Bea July', batch: 'july' }))
    await agent.post('/api/register').send(reg({ fullName: 'Al July', batch: 'july', email: 'al@example.com' }))
    await agent.post('/api/register').send(reg({ fullName: 'Gus August', batch: 'august', email: 'gus@example.com' }))
    await agent.post('/api/admin/login').send({ password: 'test-pass' })
  })

  it('requires a session', async () => {
    const res = await request(app).get('/api/admin/attendance?batch=july')
    expect(res.status).toBe(401)
  })

  it('lists July dates and only July candidates, ordered by name', async () => {
    const res = await agent.get('/api/admin/attendance?batch=july')
    expect(res.status).toBe(200)
    expect(res.body.dates).toEqual(['2026-07-07', '2026-07-14', '2026-07-21', '2026-07-28'])
    expect(res.body.candidates.map((c) => c.full_name)).toEqual(['Al July', 'Bea July'])
    expect(res.body.present).toEqual([])
  })

  it('marks present (idempotent) then absent', async () => {
    const list = await agent.get('/api/admin/attendance?batch=july')
    const id = list.body.candidates[0].id
    await agent.put('/api/admin/attendance').send({ registrationId: id, date: '2026-07-07', present: true })
    await agent.put('/api/admin/attendance').send({ registrationId: id, date: '2026-07-07', present: true })
    let after = await agent.get('/api/admin/attendance?batch=july')
    expect(after.body.present.filter((p) => p.registration_id === id && p.date === '2026-07-07')).toHaveLength(1)

    await agent.put('/api/admin/attendance').send({ registrationId: id, date: '2026-07-07', present: false })
    after = await agent.get('/api/admin/attendance?batch=july')
    expect(after.body.present.filter((p) => p.registration_id === id)).toHaveLength(0)
  })

  it('rejects a non-July date', async () => {
    const list = await agent.get('/api/admin/attendance?batch=july')
    const id = list.body.candidates[0].id
    const res = await agent.put('/api/admin/attendance').send({ registrationId: id, date: '2026-07-15', present: true })
    expect(res.status).toBe(400)
  })

  it('rejects marking an August registrant', async () => {
    const gus = db.prepare("SELECT id FROM registrations WHERE batch = 'august'").get()
    const res = await agent.put('/api/admin/attendance').send({ registrationId: gus.id, date: '2026-07-07', present: true })
    expect(res.status).toBe(400)
  })

  it('404s an unknown registrant', async () => {
    const res = await agent.put('/api/admin/attendance').send({ registrationId: 99999, date: '2026-07-07', present: true })
    expect(res.status).toBe(404)
  })

  it('blocks the toggle without a session', async () => {
    const res = await request(app).put('/api/admin/attendance').send({ registrationId: 1, date: '2026-07-07', present: true })
    expect(res.status).toBe(401)
  })

  it('rejects a toggle missing the present flag', async () => {
    const list = await agent.get('/api/admin/attendance?batch=july')
    const id = list.body.candidates[0].id
    const res = await agent.put('/api/admin/attendance').send({ registrationId: id, date: '2026-07-07' })
    expect(res.status).toBe(400)
  })

  it('rejects attendance for a non-July batch', async () => {
    const res = await agent.get('/api/admin/attendance?batch=august')
    expect(res.status).toBe(400)
  })
})
