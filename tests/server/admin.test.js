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

describe('admin auth', () => {
  let app
  beforeEach(() => { ({ app } = makeApp()) })

  it('rejects the registrations list without a session', async () => {
    const res = await request(app).get('/api/admin/registrations')
    expect(res.status).toBe(401)
  })

  it('rejects a wrong password', async () => {
    const res = await request(app).post('/api/admin/login').send({ password: 'nope' })
    expect(res.status).toBe(401)
  })

  it('accepts the right password and then lists registrations', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(reg())
    const login = await agent.post('/api/admin/login').send({ password: 'test-pass' })
    expect(login.status).toBe(200)
    const list = await agent.get('/api/admin/registrations')
    expect(list.status).toBe(200)
    expect(list.body.rows.length).toBe(1)
    expect(list.body.counts.total).toBe(1)
    expect(list.body.counts.unpaid).toBe(1)
  })

  it('logout invalidates the session', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(reg())
    await agent.post('/api/admin/login').send({ password: 'test-pass' })
    await agent.post('/api/admin/logout')
    const res = await agent.get('/api/admin/registrations')
    expect(res.status).toBe(401)
  })
})

describe('admin filters + paid toggle + csv', () => {
  let app, agent
  beforeEach(async () => {
    ;({ app } = makeApp())
    agent = request.agent(app)
    await agent.post('/api/register').send(reg({ fullName: 'July Person', batch: 'july' }))
    await agent.post('/api/register').send(reg({ fullName: 'Aug Person', batch: 'august', email: 'aug@example.com' }))
    await agent.post('/api/admin/login').send({ password: 'test-pass' })
  })

  it('filters by batch', async () => {
    const res = await agent.get('/api/admin/registrations?batch=august')
    expect(res.body.rows.length).toBe(1)
    expect(res.body.rows[0].full_name).toBe('Aug Person')
  })

  it('searches by name/email', async () => {
    const res = await agent.get('/api/admin/registrations?q=July')
    expect(res.body.rows.length).toBe(1)
    expect(res.body.rows[0].full_name).toBe('July Person')
  })

  it('toggles paid and stamps paid_at, then filters by paid', async () => {
    const list = await agent.get('/api/admin/registrations')
    const id = list.body.rows[0].id
    const patch = await agent.patch(`/api/admin/registrations/${id}`).send({ paid: true })
    expect(patch.status).toBe(200)
    expect(patch.body.paid).toBe(1)
    expect(patch.body.paid_at).toBeTruthy()

    const paidList = await agent.get('/api/admin/registrations?paid=true')
    expect(paidList.body.rows.length).toBe(1)

    const off = await agent.patch(`/api/admin/registrations/${id}`).send({ paid: false })
    expect(off.body.paid).toBe(0)
    expect(off.body.paid_at).toBeNull()
  })

  it('exports CSV with a header row', async () => {
    const res = await agent.get('/api/admin/export.csv')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/csv/)
    expect(res.text.split('\n')[0]).toContain('Name')
    expect(res.text).toContain('July Person')
  })

  it('blocks the paid toggle without a session', async () => {
    const res = await request(app).patch('/api/admin/registrations/1').send({ paid: true })
    expect(res.status).toBe(401)
  })

  it('filters by unpaid (paid=false)', async () => {
    const res = await agent.get('/api/admin/registrations?paid=false')
    expect(res.body.rows.length).toBe(2)
  })
})
