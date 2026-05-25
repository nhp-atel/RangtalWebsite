# July Attendance Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Attendance" tab to the admin page where the team marks July-batch dancers present/absent for each July Tuesday with one click, persisted to SQLite.

**Architecture:** Reuses the existing Express + SQLite backend and `requireAuth` session guard. Adds a date config, an `attendance` table (a row = "present"; absent = no row), two session-gated endpoints under `/api/admin/attendance`, and a self-contained `AttendanceSheet` React component shown via a tab switch in the existing admin page.

**Tech Stack:** Node/Express 5, better-sqlite3, express-session; Vitest + Supertest; React 18 + Vite + Tailwind.

**Spec:** `docs/superpowers/specs/2026-05-25-attendance-sheet-design.md`

---

## File Structure

```
server/lib/sessions.js          NEW — July Tuesday dates + isValidSessionDate
server/db.js                    MODIFY — add the attendance table + indexes
server/routes/attendance.js     NEW — attendanceRouter(db): GET list + PUT toggle
server/app.js                   MODIFY — mount attendanceRouter at /api/admin/attendance
src/pages/AttendanceSheet.jsx   NEW — the grid component (own fetch/state)
src/pages/Admin.jsx             MODIFY — tab switch between Registrations and Attendance
tests/server/sessions.test.js   NEW
tests/server/db.test.js         MODIFY — add attendance-table test
tests/server/attendance.test.js NEW
```

---

## Task 1: Session dates config + attendance table

**Files:**
- Create: `server/lib/sessions.js`
- Create: `tests/server/sessions.test.js`
- Modify: `server/db.js`
- Modify: `tests/server/db.test.js`

- [ ] **Step 1: Write the failing session-config test** — create `tests/server/sessions.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { JULY_TUESDAYS, isValidSessionDate } from '../../server/lib/sessions.js'

describe('sessions', () => {
  it('lists the four July 2026 Tuesdays', () => {
    expect(JULY_TUESDAYS).toEqual(['2026-07-07', '2026-07-14', '2026-07-21', '2026-07-28'])
  })
  it('validates session dates', () => {
    expect(isValidSessionDate('2026-07-14')).toBe(true)
    expect(isValidSessionDate('2026-07-15')).toBe(false)
    expect(isValidSessionDate('')).toBe(false)
    expect(isValidSessionDate(undefined)).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/server/sessions.test.js`
Expected: FAIL — cannot resolve `server/lib/sessions.js`.

- [ ] **Step 3: Create `server/lib/sessions.js`**:
```js
// Server-side source of truth for class session dates.
// The July 2026 batch meets on these Tuesdays.
export const JULY_TUESDAYS = ['2026-07-07', '2026-07-14', '2026-07-21', '2026-07-28']

export const isValidSessionDate = (d) =>
  typeof d === 'string' && JULY_TUESDAYS.includes(d)
```

- [ ] **Step 4: Add the attendance-table test to `tests/server/db.test.js`** — add this `it(...)` inside the existing `describe('createDb', ...)` block:
```js
  it('creates the attendance table with a unique (registration_id, date)', () => {
    const db = createDb(':memory:')
    const cols = db.prepare('PRAGMA table_info(attendance)').all().map((c) => c.name)
    for (const name of ['id', 'registration_id', 'date', 'created_at']) {
      expect(cols).toContain(name)
    }
    const ins = db.prepare(
      `INSERT INTO attendance (registration_id, date, created_at)
       VALUES (1, '2026-07-07', '2026-05-25T00:00:00Z')`
    )
    ins.run()
    expect(() => ins.run()).toThrow() // UNIQUE(registration_id, date)
    db.close()
  })
```

- [ ] **Step 5: Run db test to verify the new case fails**

Run: `npx vitest run tests/server/db.test.js`
Expected: FAIL — `PRAGMA table_info(attendance)` returns no columns (table doesn't exist yet).

- [ ] **Step 6: Add the attendance table to `server/db.js`** — inside the `db.exec(\`...\`)` template, immediately AFTER the `CREATE INDEX ... idx_reg_created ON registrations(created_at);` line and before the closing backtick, add:
```sql
    CREATE TABLE IF NOT EXISTS attendance (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id  INTEGER NOT NULL,
      date             TEXT NOT NULL,
      created_at       TEXT NOT NULL,
      UNIQUE(registration_id, date)
    );
    CREATE INDEX IF NOT EXISTS idx_att_date ON attendance(date);
    CREATE INDEX IF NOT EXISTS idx_att_reg  ON attendance(registration_id);
```

- [ ] **Step 7: Run both tests to verify they pass**

Run: `npx vitest run tests/server/sessions.test.js tests/server/db.test.js`
Expected: PASS (sessions 2 tests; db now 3 tests).

- [ ] **Step 8: Commit**
```bash
git add server/lib/sessions.js server/db.js tests/server/sessions.test.js tests/server/db.test.js
git commit -m "Add session-date config and attendance table"
```

---

## Task 2: Attendance API (list + toggle)

**Files:**
- Create: `server/routes/attendance.js`
- Modify: `server/app.js`
- Test: `tests/server/attendance.test.js`

- [ ] **Step 1: Write the failing test** — create `tests/server/attendance.test.js`:
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
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/server/attendance.test.js`
Expected: FAIL — the route doesn't exist (404/401 mismatches), `server/routes/attendance.js` unresolved once imported by app.js.

- [ ] **Step 3: Create `server/routes/attendance.js`**:
```js
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
```

- [ ] **Step 4: Mount the router in `server/app.js`.** Add the import after the existing `import { adminRouter } from './routes/admin.js'` line:
```js
import { attendanceRouter } from './routes/attendance.js'
```
Then, immediately AFTER the line `app.use('/api/admin', adminRouter(db, { adminPassword }))` and BEFORE the `// Unknown API routes should 404` line, add:
```js
  app.use('/api/admin/attendance', attendanceRouter(db))
```
(Order matters: it must be registered before the `app.use('/api', ...)` 404 handler. The admin router has no `/attendance` route, so requests fall through to this one.)

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/server/attendance.test.js`
Expected: PASS (7 tests).

- [ ] **Step 6: Run the whole server suite**

Run: `npm test`
Expected: PASS — all server tests green (lib, sessions, db, register, admin, attendance).

- [ ] **Step 7: Commit**
```bash
git add server/routes/attendance.js server/app.js tests/server/attendance.test.js
git commit -m "Add attendance API: list July roster + toggle present/absent"
```

---

## Task 3: AttendanceSheet React component

**Files:**
- Create: `src/pages/AttendanceSheet.jsx`

- [ ] **Step 1: Create `src/pages/AttendanceSheet.jsx`** with exactly this content:
```jsx
import { useEffect, useState, useCallback } from 'react'

// Short column label, e.g. "Jul 7", from a YYYY-MM-DD string.
function dateLabel(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const cellKey = (regId, date) => `${regId}|${date}`

export default function AttendanceSheet() {
  const [dates, setDates] = useState([])
  const [candidates, setCandidates] = useState([])
  const [present, setPresent] = useState(new Set()) // keys: `${regId}|${date}`
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/attendance?batch=july', {
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.status === 401) { setError('Your session expired — reload and sign in again.'); setLoading(false); return }
    if (!res.ok) { setError('Could not load attendance.'); setLoading(false); return }
    const body = await res.json()
    setDates(body.dates)
    setCandidates(body.candidates)
    setPresent(new Set(body.present.map((p) => cellKey(p.registration_id, p.date))))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const toggle = async (regId, date) => {
    const k = cellKey(regId, date)
    const wasPresent = present.has(k)
    const nextPresent = !wasPresent
    // optimistic update
    setPresent((s) => {
      const n = new Set(s)
      if (nextPresent) n.add(k); else n.delete(k)
      return n
    })
    const res = await fetch('/api/admin/attendance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: regId, date, present: nextPresent }),
    })
    if (!res.ok) {
      // rollback on failure
      setPresent((s) => {
        const n = new Set(s)
        if (wasPresent) n.add(k); else n.delete(k)
        return n
      })
    }
  }

  const colCount = (date) => candidates.reduce((acc, c) => acc + (present.has(cellKey(c.id, date)) ? 1 : 0), 0)
  const rowCount = (regId) => dates.reduce((acc, d) => acc + (present.has(cellKey(regId, d)) ? 1 : 0), 0)

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <h2 className="display-serif text-2xl text-cream">Attendance · July 2026</h2>
        {loading && <span className="text-xs text-cream/50">Loading…</span>}
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      {!loading && !error && candidates.length === 0 && (
        <p className="mt-6 text-cream/45">No July registrations yet.</p>
      )}

      {candidates.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-cream/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-cream/[0.04] text-[0.62rem] uppercase tracking-[0.2em] text-cream/55">
              <tr>
                <th className="px-4 py-3">Dancer</th>
                {dates.map((d) => (
                  <th key={d} className="px-4 py-3 text-center">{dateLabel(d)}</th>
                ))}
                <th className="px-4 py-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id} className="border-t border-cream/5 hover:bg-cream/[0.02]">
                  <td className="px-4 py-3 text-cream">{c.full_name}</td>
                  {dates.map((d) => {
                    const on = present.has(cellKey(c.id, d))
                    return (
                      <td key={d} className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggle(c.id, d)}
                          aria-label={on ? 'Mark absent' : 'Mark present'}
                          className={`mx-auto grid h-6 w-6 place-items-center rounded-md border transition ${
                            on ? 'border-gold bg-gold text-navy-900' : 'border-cream/30 hover:border-gold/60'
                          }`}
                        >
                          {on && (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </td>
                    )
                  })}
                  <td className="px-4 py-3 text-center text-cream/60">{rowCount(c.id)}/{dates.length}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-cream/10 bg-cream/[0.03] text-cream/70">
                <td className="px-4 py-3 text-[0.62rem] uppercase tracking-[0.2em] text-cream/55">Present</td>
                {dates.map((d) => (
                  <td key={d} className="px-4 py-3 text-center">{colCount(d)}</td>
                ))}
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Build to confirm no syntax errors**

Run: `npm run build`
Expected: builds successfully (the component isn't wired into a route yet — Task 4 does that; this just confirms it compiles).

- [ ] **Step 3: Commit**
```bash
git add src/pages/AttendanceSheet.jsx
git commit -m "Add AttendanceSheet grid component (July dancers x Tuesdays)"
```

---

## Task 4: Wire the Attendance tab into the admin page

**Files:**
- Modify: `src/pages/Admin.jsx`

Apply these four edits exactly (each `old` string is unique in the file).

- [ ] **Step 1: Import the component.**

old:
```jsx
import { useEffect, useState, useCallback, Fragment } from 'react'
```
new:
```jsx
import { useEffect, useState, useCallback, Fragment } from 'react'
import AttendanceSheet from './AttendanceSheet.jsx'
```

- [ ] **Step 2: Add the tab state.**

old:
```jsx
  const [expanded, setExpanded] = useState(null)
```
new:
```jsx
  const [expanded, setExpanded] = useState(null)
  const [tab, setTab] = useState('registrations')
```

- [ ] **Step 3: Add the tab switcher, gate Export CSV, and open the registrations block.**

old:
```jsx
          <div className="flex gap-3">
            <a href={`/api/admin/export.csv${query()}`} className="btn-ghost">Export CSV</a>
            <button onClick={logout} className="btn-ghost">Log out</button>
          </div>
        </div>

        {/* counts */}
```
new:
```jsx
          <div className="flex gap-3">
            {tab === 'registrations' && (
              <a href={`/api/admin/export.csv${query()}`} className="btn-ghost">Export CSV</a>
            )}
            <button onClick={logout} className="btn-ghost">Log out</button>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-2">
          {['registrations', 'attendance'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                tab === t ? 'bg-gold text-navy-900' : 'border border-cream/15 text-cream/70 hover:border-gold/60'
              }`}
            >
              {t === 'registrations' ? 'Registrations' : 'Attendance'}
            </button>
          ))}
        </div>

        {tab === 'registrations' && (
          <>
        {/* counts */}
```

- [ ] **Step 4: Close the registrations block and render the Attendance tab.**

old:
```jsx
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
```
new:
```jsx
            </tbody>
          </table>
        </div>
          </>
        )}

        {tab === 'attendance' && <AttendanceSheet />}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Build to confirm no syntax errors**

Run: `npm run build`
Expected: builds successfully.

- [ ] **Step 6: Manual verification (dev).** Two terminals:
```bash
ADMIN_PASSWORD=localtest SESSION_SECRET=localdev DB_PATH=./dev.sqlite npm run server
npm run dev
```
Submit at least one July registration at `http://localhost:5173/#/register` (batch July). Open `http://localhost:5173/#/admin`, sign in (`localtest`). Expected: a **Registrations | Attendance** tab switch; on **Attendance**, a grid of July dancers × Jul 7/14/21/28; clicking a cell turns it gold ✓ and the "Present" footer count + the row "Total" update; reload → the marks persist; an August registrant does NOT appear. Clean up: `rm -f dev.sqlite dev.sqlite-shm dev.sqlite-wal` and stop the servers.

- [ ] **Step 7: Commit**
```bash
git add src/pages/Admin.jsx
git commit -m "Add Attendance tab to the admin page"
```

---

## Self-Review (completed during planning)

**Spec coverage:**
- Roster = July-batch registrants → Task 2 GET (`WHERE batch = 'july'`). ✅
- 2-state toggle, default absent → Task 2 PUT (insert on present, delete on absent), Task 3 grid. ✅
- The 4 July Tuesdays from a server config → Task 1 `sessions.js`. ✅
- Storage = presence-as-row, unique(reg,date) → Task 1 schema; `INSERT OR IGNORE`/`DELETE`. ✅
- Attendance tab in existing admin page → Task 4. ✅
- Present counts per Tuesday + per dancer → Task 3 (`colCount`, `rowCount`). ✅
- Endpoints session-gated; date + batch validation → Task 2 (`requireAuth`, `isValidSessionDate`, batch check). ✅
- Tests: list/toggle/idempotent/validation/auth + db table → Tasks 1–2. ✅
- July-only scope, date-keyed table → Task 1. ✅

**Placeholder scan:** None — every code step is complete. ✅

**Type/name consistency:** `JULY_TUESDAYS`/`isValidSessionDate` (Task 1) used in Task 2; `attendanceRouter(db)` (Task 2) imported/mounted in app.js; API shapes `{dates, candidates, present}` and `{registrationId, date, present}` match between Task 2 (server) and Task 3 (client); `cellKey` consistent within Task 3; `present` rows use `registration_id`/`date` on both sides. ✅

**Deviation:** Front-end (AttendanceSheet + Admin tab) verified manually, not via automated component tests — consistent with the existing admin UI. Server logic fully covered by Vitest/Supertest.
