import { useEffect, useState, useCallback, Fragment } from 'react'
import AttendanceSheet from './AttendanceSheet.jsx'

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
  const [tab, setTab] = useState('registrations')

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
                      {r.guardian && (
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-gold/80">
                          <span className="rounded bg-gold/15 px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-wide text-gold">
                            Minor
                          </span>
                          Guardian: {r.guardian}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-cream/70">{r.email}</td>
                    <td className="px-4 py-3 text-cream/70">{r.phone}</td>
                    <td className="px-4 py-3 text-cream/70">{BATCH_LABELS[r.batch] || r.batch}</td>
                    <td className="px-4 py-3 text-cream/70">{r.level || '—'}</td>
                    <td className="px-4 py-3 text-cream/70">{r.age_group || '—'}</td>
                    <td className="px-4 py-3 text-cream/50">
                      {new Date(r.created_at).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: 'numeric', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                  {expanded === r.id && (
                    <tr className="border-t border-cream/5 bg-cream/[0.02]">
                      <td colSpan={8} className="px-4 py-3 text-cream/70">
                        <span className="text-cream/50">Ref:</span> {r.ref}
                        {'   '}<span className="text-cream/50">Emergency:</span> {r.emergency || '—'}
                        {'   '}<span className="text-cream/50">Guardian:</span> {r.guardian || '—'}
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
          </>
        )}

        {tab === 'attendance' && <AttendanceSheet />}
      </div>
    </section>
  )
}
