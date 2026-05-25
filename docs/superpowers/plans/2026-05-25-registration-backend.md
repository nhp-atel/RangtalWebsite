# Registration Backend & Payment Tracking — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist registrations to a SQLite database via a Node/Express API, and give the team an in-site admin page to list/filter/export registrations and tick a "Paid" checkbox.

**Architecture:** One Express service serves the built React app (`dist/`) and exposes `/api/*`. It reads/writes a local SQLite file (`better-sqlite3`) on a Render persistent disk. The app factory `createApp(db, opts)` takes an injected DB so tests run against an in-memory database. Admin routes are gated by a shared password held in a server-side session (httpOnly cookie).

**Tech Stack:** Node 18+ (ESM), Express, better-sqlite3, express-session, express-rate-limit. Tests: Vitest + Supertest. Frontend: existing React 18 + Vite + React Router (HashRouter) + Tailwind + Framer Motion.

**Spec:** `docs/superpowers/specs/2026-05-25-registration-backend-design.md`

---

## File Structure

```
server/
  index.js              Entry: wires createDb + createApp + listen (serves dist/)
  app.js                createApp(db, opts) — Express app factory (testable)
  db.js                 createDb(path) — better-sqlite3 connection + schema
  lib/batches.js        Server-side batch/price source of truth
  lib/ref.js            Reservation-code generator (RT-#####)
  lib/csv.js            Tiny CSV serializer
  routes/register.js    registerRouter(db) — POST /register
  routes/admin.js       adminRouter(db, opts) — login/logout/list/toggle/export
  middleware/auth.js    requireAuth — session guard
tests/server/
  register.test.js
  admin.test.js
src/
  sections/Registration.jsx   (modified — posts to /api/register, awaits result)
  pages/Admin.jsx             (new — /#/admin)
  App.jsx                     (modified — add /admin route)
docs/superpowers/specs/2026-05-25-registration-backend-design.md  (exists)
```

---

## Task 1: Project setup — dependencies, scripts, gitignore, dev proxy

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `vite.config.js`

- [ ] **Step 1: Add dependencies and scripts**

Run:
```bash
npm install express better-sqlite3 express-session express-rate-limit
npm install -D vitest supertest
```

- [ ] **Step 2: Add `start`, `server`, and `test` scripts to `package.json`**

Edit the `"scripts"` block to read exactly:
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/index.js",
    "start": "node server/index.js",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Ignore local SQLite files**

Append to `.gitignore`:
```
# local SQLite (dev)
*.sqlite
*.sqlite-shm
*.sqlite-wal
```

- [ ] **Step 4: Add the dev API proxy to `vite.config.js`**

Replace the file contents with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

- [ ] **Step 5: Verify install + build still work**

Run: `npm run build`
Expected: builds successfully, emits `dist/` (same as before).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .gitignore vite.config.js
git commit -m "Add backend deps, scripts, gitignore, and dev API proxy"
```

---

## Task 2: Pure libs — batches, ref generator, CSV serializer

**Files:**
- Create: `server/lib/batches.js`
- Create: `server/lib/ref.js`
- Create: `server/lib/csv.js`
- Test: `tests/server/lib.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/server/lib.test.js`:
```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/server/lib.test.js`
Expected: FAIL — cannot resolve `server/lib/*` modules.

- [ ] **Step 3: Implement the libs**

Create `server/lib/batches.js`:
```js
// Server-side source of truth for batches and prices.
// The client cannot be trusted to send the amount.
export const BATCHES = {
  july: { id: 'july', name: 'July Batch', price: 60 },
  august: { id: 'august', name: 'August Batch', price: 60 },
}

export const isValidBatch = (id) =>
  typeof id === 'string' && Object.prototype.hasOwnProperty.call(BATCHES, id)
```

Create `server/lib/ref.js`:
```js
// Human-friendly reservation code, e.g. "RT-48213".
export function generateRef() {
  return 'RT-' + Math.floor(10000 + Math.random() * 90000)
}
```

Create `server/lib/csv.js`:
```js
// Minimal RFC-4180-ish CSV serializer (no dependency).
export function toCsv(rows, columns) {
  const escape = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const header = columns.map((c) => escape(c.label)).join(',')
  const body = rows
    .map((r) => columns.map((c) => escape(r[c.key])).join(','))
    .join('\n')
  return header + '\n' + (body ? body + '\n' : '')
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/server/lib.test.js`
Expected: PASS (3 suites).

- [ ] **Step 5: Commit**

```bash
git add server/lib tests/server/lib.test.js
git commit -m "Add batches, ref generator, and CSV serializer libs"
```

---

## Task 3: Database module

**Files:**
- Create: `server/db.js`
- Test: `tests/server/db.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/server/db.test.js`:
```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/server/db.test.js`
Expected: FAIL — cannot resolve `server/db.js`.

- [ ] **Step 3: Implement `server/db.js`**

```js
import Database from 'better-sqlite3'

export function createDb(path) {
  const db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      ref         TEXT UNIQUE NOT NULL,
      full_name   TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT NOT NULL,
      age_group   TEXT,
      batch       TEXT NOT NULL,
      level       TEXT,
      emergency   TEXT,
      notes       TEXT,
      amount      INTEGER NOT NULL,
      agreed      INTEGER NOT NULL DEFAULT 0,
      paid        INTEGER NOT NULL DEFAULT 0,
      paid_at     TEXT,
      created_at  TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reg_batch   ON registrations(batch);
    CREATE INDEX IF NOT EXISTS idx_reg_paid    ON registrations(paid);
    CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at);
  `)
  return db
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/server/db.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add server/db.js tests/server/db.test.js
git commit -m "Add SQLite registrations schema (createDb)"
```

---

## Task 4: Register route + app factory

**Files:**
- Create: `server/routes/register.js`
- Create: `server/app.js`
- Create: `server/middleware/auth.js` (stub used by app factory mount; full logic in Task 5)
- Test: `tests/server/register.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/server/register.test.js`:
```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/server/register.test.js`
Expected: FAIL — cannot resolve `server/app.js`.

- [ ] **Step 3: Implement the auth middleware stub**

Create `server/middleware/auth.js`:
```js
export function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next()
  return res.status(401).json({ error: 'Not authenticated.' })
}
```

- [ ] **Step 4: Implement the register route**

Create `server/routes/register.js`:
```js
import { Router } from 'express'
import { BATCHES, isValidBatch } from '../lib/batches.js'
import { generateRef } from '../lib/ref.js'

export function registerRouter(db) {
  const router = Router()

  const insert = db.prepare(`
    INSERT INTO registrations
      (ref, full_name, email, phone, age_group, batch, level, emergency, notes, amount, agreed, paid, paid_at, created_at)
    VALUES
      (@ref, @full_name, @email, @phone, @age_group, @batch, @level, @emergency, @notes, @amount, @agreed, 0, NULL, @created_at)
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
          notes: b.notes || null,
          amount,
          agreed: 1,
          created_at: new Date().toISOString(),
        })
        return res.status(201).json({ ref, batch: b.batch })
      } catch (e) {
        if (String(e.message).includes('UNIQUE') && attempt < 4) continue
        return res.status(500).json({ error: 'Could not save your registration. Please try again.' })
      }
    }
    return res.status(500).json({ error: 'Could not save your registration. Please try again.' })
  })

  return router
}
```

- [ ] **Step 5: Implement the app factory (admin router referenced now, created in Task 5)**

Create `server/app.js`. NOTE: the import of `./routes/admin.js` is added here but that file is created in Task 5; running this task's tests requires Task 5's file to exist. To keep Task 4 runnable on its own, create a minimal placeholder `server/routes/admin.js` now and flesh it out in Task 5:

First create the placeholder `server/routes/admin.js`:
```js
import { Router } from 'express'
// Fleshed out in Task 5.
export function adminRouter() {
  return Router()
}
```

Then create `server/app.js`:
```js
import express from 'express'
import session from 'express-session'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerRouter } from './routes/register.js'
import { adminRouter } from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp(db, opts = {}) {
  const {
    adminPassword = process.env.ADMIN_PASSWORD || '',
    sessionSecret = process.env.SESSION_SECRET || 'dev-secret-change-me',
    serveStatic = false,
  } = opts

  const app = express()
  app.set('trust proxy', 1)
  app.use(express.json())
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8,
      },
    })
  )

  const registerLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/api/register', registerLimiter)

  app.use('/api', registerRouter(db))
  app.use('/api/admin', adminRouter(db, { adminPassword }))

  // Unknown API routes should 404 as JSON, not fall through to the SPA.
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))

  if (serveStatic) {
    const dist = path.join(__dirname, '..', 'dist')
    app.use(express.static(dist))
    app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
  }

  return app
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/server/register.test.js`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add server/app.js server/routes/register.js server/routes/admin.js server/middleware/auth.js tests/server/register.test.js
git commit -m "Add POST /api/register with validation, honeypot, and app factory"
```

---

## Task 5: Admin auth + list + filters + counts + paid toggle + CSV

**Files:**
- Modify: `server/routes/admin.js` (replace the placeholder)
- Test: `tests/server/admin.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/server/admin.test.js`:
```js
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
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/server/admin.test.js`
Expected: FAIL — admin routes return 404/401 because the router is still the Task 4 placeholder.

- [ ] **Step 3: Replace `server/routes/admin.js` with the full implementation**

```js
import { Router } from 'express'
import crypto from 'node:crypto'
import { requireAuth } from '../middleware/auth.js'
import { toCsv } from '../lib/csv.js'

function safeEqual(a, b) {
  const ab = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

function buildFilter(q) {
  const where = []
  const params = {}
  if (q.batch) { where.push('batch = @batch'); params.batch = q.batch }
  if (q.paid === 'true') where.push('paid = 1')
  if (q.paid === 'false') where.push('paid = 0')
  if (q.q) { where.push('(full_name LIKE @like OR email LIKE @like)'); params.like = '%' + q.q + '%' }
  return { clause: where.length ? 'WHERE ' + where.join(' AND ') : '', params }
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
    const { clause, params } = buildFilter(req.query)
    const rows = db.prepare(`SELECT * FROM registrations ${clause} ORDER BY created_at DESC`).all(params)
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
    const { clause, params } = buildFilter(req.query)
    const rows = db.prepare(`SELECT * FROM registrations ${clause} ORDER BY created_at DESC`).all(params)
    const columns = [
      { key: 'ref', label: 'Ref' },
      { key: 'full_name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'age_group', label: 'Age' },
      { key: 'batch', label: 'Batch' },
      { key: 'level', label: 'Level' },
      { key: 'emergency', label: 'Emergency' },
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/server/admin.test.js`
Expected: PASS (auth suite 3 tests + filters suite 5 tests).

- [ ] **Step 5: Run the whole server test suite**

Run: `npm test`
Expected: PASS — all server tests green (lib, db, register, admin).

- [ ] **Step 6: Commit**

```bash
git add server/routes/admin.js tests/server/admin.test.js
git commit -m "Add admin API: login, list/filter/counts, paid toggle, CSV export"
```

---

## Task 6: Server entry point + static serving

**Files:**
- Create: `server/index.js`

- [ ] **Step 1: Implement `server/index.js`**

```js
import { createApp } from './app.js'
import { createDb } from './db.js'

const dbPath =
  process.env.DB_PATH ||
  (process.env.NODE_ENV === 'production' ? '/data/registrations.sqlite' : './dev.sqlite')

const db = createDb(dbPath)
const app = createApp(db, { serveStatic: true })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Rangtaal server listening on :${port} (db: ${dbPath})`)
})
```

- [ ] **Step 2: Smoke-test the API end to end against a built app**

Run:
```bash
npm run build
ADMIN_PASSWORD=localtest SESSION_SECRET=localdev DB_PATH=./dev.sqlite node server/index.js &
sleep 1
curl -s -X POST localhost:3000/api/register -H 'Content-Type: application/json' \
  -d '{"fullName":"Smoke Test","email":"smoke@example.com","phone":"6305550142","batch":"july","level":"social","ageGroup":"18—25","agreed":true}'
echo
curl -s -i localhost:3000/ | head -1
kill %1
rm -f dev.sqlite dev.sqlite-shm dev.sqlite-wal
```
Expected: the POST returns `{"ref":"RT-#####","batch":"july"}`; the `GET /` returns `HTTP/1.1 200 OK` (the SPA).

- [ ] **Step 3: Commit**

```bash
git add server/index.js
git commit -m "Add server entry point with SPA static serving"
```

---

## Task 7: Wire the registration form to the API

**Files:**
- Modify: `src/sections/Registration.jsx`

- [ ] **Step 1: Remove the dead Google Form integration**

Delete the `GOOGLE_FORM` const, the `GOOGLE_FORM_READY` const, and the entire `submitToGoogleForm` function (lines defining them in the current file, roughly the block from the `// --- Google Form integration ---` comment through the `GOOGLE_FORM_READY` line, plus the `submitToGoogleForm` function body).

- [ ] **Step 2: Add submit state near the other hooks**

In the component body, just after `const set = (k, v) => ...`, add:
```jsx
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [refCode, setRefCode] = useState('')
```

- [ ] **Step 3: Replace `handleNext` with an async API submit**

Replace the existing `handleNext` function with:
```jsx
  const submitRegistration = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          ageGroup: data.age,
          batch: data.workshop,
          level: data.level,
          emergency: data.emergency,
          notes: data.notes,
          agreed: data.agreed,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(body.error || 'Something went wrong. Your spot was not saved.')
        return false
      }
      setRefCode(body.ref || '')
      return true
    } catch {
      setSubmitError('Network error. Your spot was not saved — please try again.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (!canAdvance() || submitting) return
    if (step === 4) {
      const ok = await submitRegistration()
      if (!ok) return
    }
    next()
  }
```

- [ ] **Step 4: Show the real ref and a submit error on the payment step**

In the confirmation step (step === 5), replace the random reservation ID expression
`RT-{Math.floor(Math.random() * 90000 + 10000)}` with:
```jsx
{refCode || '—'}
```

In the payment step (step === 4), add an error line just before the closing `</motion.div>` of that step:
```jsx
                      {submitError && (
                        <p className="mt-4 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                          {submitError}
                        </p>
                      )}
```

- [ ] **Step 5: Reflect the submitting state on the Continue/Confirm button**

In the navigation block, replace the confirm button label expression and disabled logic:
```jsx
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canAdvance() || submitting}
                    className={`btn-primary !px-7 !py-3 ${!canAdvance() || submitting ? 'pointer-events-none opacity-40' : ''}`}
                  >
                    {step === 4 ? (submitting ? 'Saving…' : 'Confirm & Register') : 'Continue'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
```

Also reset the new state in the "Register someone else" handler (step 5): change `onClick={() => { setData(initial); setStep(0) }}` to also clear `setRefCode('')` and `setSubmitError('')`.

- [ ] **Step 6: Manual verification (dev)**

Run in two terminals:
```bash
# terminal 1
ADMIN_PASSWORD=localtest SESSION_SECRET=localdev DB_PATH=./dev.sqlite npm run server
# terminal 2
npm run dev
```
Open `http://localhost:5173/#/register`, complete the flow. Expected: the confirmation shows a real `RT-#####` code; the row appears in `dev.sqlite`. Then force an error (stop the server, submit) — expected: an error message shows and you stay on the payment step (no false success).

- [ ] **Step 7: Build to confirm no syntax errors**

Run: `npm run build`
Expected: builds successfully.

- [ ] **Step 8: Commit**

```bash
git add src/sections/Registration.jsx
git commit -m "Wire registration form to POST /api/register (real ref + error states)"
```

---

## Task 8: Admin page + route

**Files:**
- Create: `src/pages/Admin.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `src/pages/Admin.jsx`**

```jsx
import { useEffect, useState, useCallback, Fragment } from 'react'

const BATCH_LABELS = { july: 'July', august: 'August' }

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  return res
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [rows, setRows] = useState([])
  const [counts, setCounts] = useState({ total: 0, paid: 0, unpaid: 0, byBatch: {} })
  const [q, setQ] = useState('')
  const [batch, setBatch] = useState('')
  const [paid, setPaid] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const query = () => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (batch) p.set('batch', batch)
    if (paid) p.set('paid', paid)
    const s = p.toString()
    return s ? `?${s}` : ''
  }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await api(`/admin/registrations${query()}`)
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const body = await res.json()
    setRows(body.rows)
    setCounts(body.counts)
    setAuthed(true)
    setLoading(false)
  }, [q, batch, paid])

  useEffect(() => { load() }, [load])

  const login = async (e) => {
    e.preventDefault()
    setLoginError('')
    const res = await api('/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
    if (res.ok) { setPassword(''); load() }
    else setLoginError('Incorrect password.')
  }

  const logout = async () => {
    await api('/admin/logout', { method: 'POST' })
    setAuthed(false)
    setRows([])
  }

  const togglePaid = async (row) => {
    const nextPaid = row.paid ? false : true
    // optimistic
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, paid: nextPaid ? 1 : 0 } : r)))
    const res = await api(`/admin/registrations/${row.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ paid: nextPaid }),
    })
    if (!res.ok) {
      // rollback
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, paid: row.paid } : r)))
      return
    }
    const updated = await res.json()
    setRows((rs) => rs.map((r) => (r.id === row.id ? updated : r)))
    setCounts((c) => ({
      ...c,
      paid: c.paid + (nextPaid ? 1 : -1),
      unpaid: c.unpaid + (nextPaid ? -1 : 1),
    }))
  }

  if (!authed) {
    return (
      <section className="grid min-h-screen place-items-center bg-navy-900 p-6">
        <form onSubmit={login} className="w-full max-w-sm rounded-[24px] border border-cream/10 bg-cream/[0.03] p-8">
          <div className="section-label">Team area</div>
          <h1 className="display-serif mt-3 text-2xl text-cream">Registrations admin</h1>
          <p className="mt-2 text-sm text-cream/60">Enter the team password to continue.</p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Team password"
            className="mt-5 w-full rounded-xl border border-cream/15 bg-cream/[0.04] px-4 py-3 text-sm text-cream outline-none focus:border-gold/60"
          />
          {loginError && <p className="mt-3 text-sm text-red-300">{loginError}</p>}
          <button type="submit" className="btn-primary mt-5 w-full justify-center">Sign in</button>
        </form>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-navy-900 px-5 py-12 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="section-label">Team area</div>
            <h1 className="display-serif mt-2 text-3xl text-cream">Registrations</h1>
          </div>
          <div className="flex gap-3">
            <a href={`/api/admin/export.csv${query()}`} className="btn-ghost">Export CSV</a>
            <button onClick={logout} className="btn-ghost">Log out</button>
          </div>
        </div>

        {/* counts */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Total', counts.total],
            ['Paid', counts.paid],
            ['Unpaid', counts.unpaid],
            ['Batches', Object.entries(counts.byBatch).map(([b, n]) => `${BATCH_LABELS[b] || b} ${n}`).join(' · ') || '—'],
          ].map(([label, val]) => (
            <div key={label} className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4">
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/55">{label}</p>
              <p className="display-serif mt-1 text-2xl text-cream">{val}</p>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="w-full max-w-xs rounded-xl border border-cream/15 bg-cream/[0.04] px-4 py-2.5 text-sm text-cream outline-none focus:border-gold/60"
          />
          <select value={batch} onChange={(e) => setBatch(e.target.value)}
            className="rounded-xl border border-cream/15 bg-navy-800 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold/60">
            <option value="">All batches</option>
            <option value="july">July</option>
            <option value="august">August</option>
          </select>
          <select value={paid} onChange={(e) => setPaid(e.target.value)}
            className="rounded-xl border border-cream/15 bg-navy-800 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold/60">
            <option value="">Paid + Unpaid</option>
            <option value="true">Paid only</option>
            <option value="false">Unpaid only</option>
          </select>
          {loading && <span className="text-xs text-cream/50">Loading…</span>}
        </div>

        {/* table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-cream/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-cream/[0.04] text-[0.62rem] uppercase tracking-[0.2em] text-cream/55">
              <tr>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Fragment key={r.id}>
                  <tr className="border-t border-cream/5 hover:bg-cream/[0.02]">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePaid(r)}
                        aria-label={r.paid ? 'Mark unpaid' : 'Mark paid'}
                        className={`grid h-6 w-6 place-items-center rounded-md border transition ${
                          r.paid ? 'border-gold bg-gold text-navy-900' : 'border-cream/30 hover:border-gold/60'
                        }`}
                      >
                        {!!r.paid && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-cream hover:text-gold">
                        {r.full_name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-cream/70">{r.email}</td>
                    <td className="px-4 py-3 text-cream/70">{r.phone}</td>
                    <td className="px-4 py-3 text-cream/70">{BATCH_LABELS[r.batch] || r.batch}</td>
                    <td className="px-4 py-3 text-cream/70">{r.level || '—'}</td>
                    <td className="px-4 py-3 text-cream/70">{r.age_group || '—'}</td>
                    <td className="px-4 py-3 text-cream/50">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                  {expanded === r.id && (
                    <tr className="border-t border-cream/5 bg-cream/[0.02]">
                      <td colSpan={8} className="px-4 py-3 text-cream/70">
                        <span className="text-cream/50">Ref:</span> {r.ref}
                        {'   '}<span className="text-cream/50">Emergency:</span> {r.emergency || '—'}
                        {'   '}<span className="text-cream/50">Notes:</span> {r.notes || '—'}
                        {r.paid_at && <>{'   '}<span className="text-cream/50">Paid at:</span> {new Date(r.paid_at).toLocaleString()}</>}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {rows.length === 0 && !loading && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-cream/45">No registrations match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add the `/admin` route in `src/App.jsx`**

After the other `lazy(...)` imports (near line 16), add:
```jsx
const Admin = lazy(() => import('./pages/Admin.jsx'))
```
Inside `<Routes>` (before the `<Route path="*" ... />` catch-all), add:
```jsx
              <Route path="/admin" element={<Admin />} />
```

- [ ] **Step 3: Manual verification (dev)**

With the server (terminal 1) and `npm run dev` (terminal 2) running and at least one registration submitted, open `http://localhost:5173/#/admin`. Expected: password prompt → after `localtest`, the roster loads; ticking the Paid box updates the count and persists across reload; the batch/paid/search filters work; "Export CSV" downloads a file; "Log out" returns to the prompt.

- [ ] **Step 4: Build to confirm no syntax errors**

Run: `npm run build`
Expected: builds successfully.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Admin.jsx src/App.jsx
git commit -m "Add team admin page (/admin): roster, filters, paid toggle, CSV"
```

---

## Task 9: Deployment config + docs

**Files:**
- Modify: `render.yaml`
- Modify: `README.md`

- [ ] **Step 1: Replace `render.yaml` with a Node web service + persistent disk**

```yaml
services:
  - type: web
    name: rangtaal
    runtime: node
    plan: starter            # paid tier — required for a persistent disk
    buildCommand: npm ci && npm run build
    startCommand: node server/index.js
    healthCheckPath: /
    pullRequestPreviewsEnabled: true
    disk:
      name: data
      mountPath: /data
      sizeGB: 1
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_PATH
        value: /data/registrations.sqlite
      - key: ADMIN_PASSWORD
        sync: false           # set this secret in the Render dashboard
      - key: SESSION_SECRET
        generateValue: true
    headers:
      - path: /assets/*
        name: Cache-Control
        value: public, max-age=31536000, immutable
```

- [ ] **Step 2: Document local run + deploy in `README.md`**

Add a section to `README.md`:
```markdown
## Backend (registrations + admin)

Registrations are saved to SQLite via an Express API; the team manages them at `/#/admin`.

### Local development
Run the API and the Vite dev server in two terminals:
```bash
# terminal 1 — API on :3000 (Vite proxies /api to it)
ADMIN_PASSWORD=localtest SESSION_SECRET=localdev DB_PATH=./dev.sqlite npm run server
# terminal 2 — site on :5173
npm run dev
```
Admin page: http://localhost:5173/#/admin (password: `localtest`).

### Tests
```bash
npm test
```

### Deploy (Render)
One web service serves the built app and the API. It needs a **persistent disk**
(paid plan) so the SQLite file survives restarts. Set `ADMIN_PASSWORD` in the
Render dashboard (it is `sync: false`); `SESSION_SECRET` is generated automatically.
```

- [ ] **Step 3: Final full check**

Run: `npm test && npm run build`
Expected: all tests pass; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add render.yaml README.md
git commit -m "Switch Render to Node web service with persistent disk; document backend"
```

---

## Self-Review (completed during planning)

**Spec coverage:**
- SQLite storage → Tasks 3, 6. ✅
- Persistent disk / Render web service → Task 9. ✅
- One service serves app + API → Tasks 4 (factory), 6 (static). ✅
- Table schema (all columns) → Task 3. ✅
- POST /api/register with validation, server-derived amount, honeypot, rate-limit → Tasks 4 (route/limiter). ✅
- Shared-password admin auth + httpOnly session + 401 guard → Tasks 4 (middleware), 5 (login/guard). ✅
- List + filters + search + counts → Task 5. ✅
- Paid toggle (the checkbox) + paid_at → Task 5 (API), Task 8 (UI). ✅
- CSV export (filtered) → Task 5. ✅
- Admin page styled on-brand → Task 8. ✅
- Registration form posts to API, real ref, error states, drop Google Form → Task 7. ✅
- Deploy config + env vars → Task 9. ✅
- Privacy (auth-gated PII, no PII logs) → auth guard (Tasks 4/5); no logging added. ✅

**Deviation from spec:** The spec mentioned "light front-end checks" for the registration submit and admin toggle. This plan covers those via **manual** verification steps (Task 7 Step 6, Task 8 Step 3) rather than automated component tests, to avoid adding jsdom/testing-library infrastructure. The server logic — where correctness matters — is fully covered by automated Vitest/Supertest tests. Add component tests later if desired.

**Placeholder scan:** No TBD/TODO; every code step contains complete code. ✅

**Type/name consistency:** `createDb(path)`, `createApp(db, opts)`, `registerRouter(db)`, `adminRouter(db, { adminPassword })`, `requireAuth`, `toCsv(rows, columns)`, `generateRef()`, `BATCHES`/`isValidBatch` are used consistently across tasks. API response shapes (`{ ref, batch }`, `{ rows, counts }`, updated-row on PATCH) match between server tasks and the front-end consumers. ✅
