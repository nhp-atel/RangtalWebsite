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
    setError('')
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
      // rollback on failure and tell the user (e.g. an expired session)
      setPresent((s) => {
        const n = new Set(s)
        if (wasPresent) n.add(k); else n.delete(k)
        return n
      })
      setError('Could not save — your session may have expired. Reload and try again.')
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
        <>
          {/* Mobile cards — one per dancer with date toggles */}
          <div className="mt-6 grid gap-3 md:hidden">
            {candidates.map((c) => {
              const total = rowCount(c.id)
              return (
                <article key={c.id} className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 truncate text-base font-semibold text-cream">{c.full_name}</p>
                    <span className="shrink-0 rounded-full border border-cream/15 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-cream/70">
                      {total}/{dates.length}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {dates.map((d) => {
                      const on = present.has(cellKey(c.id, d))
                      return (
                        <button
                          key={d}
                          onClick={() => toggle(c.id, d)}
                          aria-label={`${dateLabel(d)} ${on ? 'present' : 'absent'}`}
                          aria-pressed={on}
                          className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                            on
                              ? 'border-gold/60 bg-gold/15 text-cream'
                              : 'border-cream/15 bg-cream/[0.03] text-cream/70 hover:border-gold/50'
                          }`}
                        >
                          <span className="text-xs uppercase tracking-[0.18em]">{dateLabel(d)}</span>
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-md border ${
                              on ? 'border-gold bg-gold text-navy-900' : 'border-cream/30'
                            }`}
                          >
                            {on && (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </div>

          {/* Per-date totals strip — visible on mobile too */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-cream/10 bg-cream/[0.03] p-3 text-[0.62rem] uppercase tracking-[0.18em] text-cream/55 sm:grid-cols-4 md:hidden">
            {dates.map((d) => (
              <div key={d} className="flex items-center justify-between gap-2 px-1">
                <span>{dateLabel(d)}</span>
                <span className="text-cream">{colCount(d)}</span>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-cream/10 md:block">
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
        </>
      )}
    </div>
  )
}
