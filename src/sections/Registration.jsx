import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = ['Batch', 'Level', 'Details', 'Conduct', 'Payment', 'Confirm']

const CONDUCT = [
  {
    title: 'No refunds',
    body: 'All sign-ups are final. Once you register for the month, the fee is non-refundable.',
  },
  {
    title: 'Monthly only',
    body: 'Classes are sold by the month — there is no pay-per-class or single drop-in option.',
  },
  {
    title: 'Respect the circle',
    body: 'Show up on time, cheer every dancer on, and keep the floor welcoming for all levels.',
  },
  {
    title: 'Look out for each other',
    body: 'Be patient with beginners — every one of us started somewhere. Garba is a team sport.',
  },
]

// One class, every Tuesday 7:30–9:30 PM — currently just the June batch.
const WORKSHOPS = [
  { id: 'june', name: 'June Batch', date: 'Tuesdays · 7:30 – 9:30 PM', price: 60, color: '#7B2CBF', tag: 'Open now' },
]

// --- Google Form integration ---------------------------------------------
// The live form ("Rangtaal: June Garba Workshops 2026") reopens weekly. To pipe
// these submissions straight into it, paste each field's entry ID below.
// How to get them: open the LIVE form → ⋮ menu → "Get pre-filled link" →
// fill dummy values → "Get link" → copy the entry.XXXXXXX numbers from the URL.
// Until at least one is filled, the form just shows the confirmation screen.
const GOOGLE_FORM = {
  id: '1FAIpQLSdDiTvWBFypdFEWxdMoHw-OexwNFpbf0HGdOrHhtYBGjAsNfw',
  entries: {
    fullName: '', // e.g. 'entry.123456789'
    email: '',
    phone: '',
    age: '',
    batch: '',
    level: '',
    emergency: '',
    notes: '',
  },
}
const GOOGLE_FORM_READY = Object.values(GOOGLE_FORM.entries).some(Boolean)

const LEVELS = [
  { id: 'first', title: 'First time', sub: 'No experience needed — we’ll start at zero.' },
  { id: 'social', title: 'Social dancer', sub: 'I’ve been to Garba nights, never trained formally.' },
  { id: 'trained', title: 'Trained dancer', sub: 'I’ve done dance before, ready for choreography.' },
  { id: 'pro', title: 'Performer / Pro', sub: 'I’ve performed on stage or teach others.' },
]

const AGE_GROUPS = ['6—12', '13—17', '18—25', '26—40', '40+']

const initial = {
  workshop: WORKSHOPS.length === 1 ? WORKSHOPS[0].id : null,
  level: null,
  fullName: '',
  email: '',
  phone: '',
  age: '',
  emergency: '',
  notes: '',
  agreed: false,
}

function Stepper({ step }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:gap-4">
      {STEPS.map((s, i) => {
        const active = step === i
        const done = step > i
        return (
          <div key={s} className="flex shrink-0 items-center gap-3">
            <div
              className={`relative grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition-all duration-500 ${
                done
                  ? 'border-gold/0 bg-gradient-to-br from-gold to-marigold text-navy-900'
                  : active
                  ? 'border-gold text-gold'
                  : 'border-cream/15 text-cream/45'
              }`}
            >
              {done ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                String(i + 1).padStart(2, '0')
              )}
              {active && (
                <span className="absolute -inset-1 -z-10 rounded-full bg-gold/15 blur-md" />
              )}
            </div>
            <span
              className={`hidden text-[0.7rem] uppercase tracking-[0.3em] sm:block ${
                active ? 'text-cream' : done ? 'text-cream/70' : 'text-cream/40'
              }`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <span className={`hidden h-px w-8 md:block ${done ? 'bg-gold/70' : 'bg-cream/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-[0.62rem] uppercase tracking-[0.32em] text-cream/55">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1 block text-[0.7rem] text-cream/40">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-cream/15 bg-cream/[0.04] px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none transition focus:border-gold/60 focus:bg-cream/[0.07] focus:shadow-[0_0_0_4px_rgba(244,185,66,0.08)]'

export default function Registration() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(initial)
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }))

  const chosenWs = useMemo(() => WORKSHOPS.find((w) => w.id === data.workshop), [data.workshop])
  const total = chosenWs ? chosenWs.price : 0
  const grand = total

  const canAdvance = () => {
    if (step === 0) return !!data.workshop
    if (step === 1) return !!data.level
    if (step === 2)
      return data.fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(data.email) && data.phone.replace(/\D/g, '').length >= 8 && data.age
    if (step === 3) return data.agreed
    return true
  }

  const next = () => canAdvance() && setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  // Pipe the submission into the live Google Form (no-cors fire-and-forget).
  const submitToGoogleForm = () => {
    if (!GOOGLE_FORM_READY) return
    const e = GOOGLE_FORM.entries
    const fd = new FormData()
    const add = (key, val) => key && val && fd.append(key, val)
    add(e.fullName, data.fullName)
    add(e.email, data.email)
    add(e.phone, data.phone)
    add(e.age, data.age)
    add(e.batch, chosenWs?.name)
    add(e.level, LEVELS.find((l) => l.id === data.level)?.title)
    add(e.emergency, data.emergency)
    add(e.notes, data.notes)
    fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM.id}/formResponse`, {
      method: 'POST',
      mode: 'no-cors',
      body: fd,
    }).catch(() => {})
  }

  const handleNext = () => {
    if (!canAdvance()) return
    if (step === 4) submitToGoogleForm()
    next()
  }

  return (
    <section id="register" className="relative isolate overflow-hidden py-28">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1a0930] via-navy-900 to-navy-900" />
      <div className="absolute -left-10 top-20 -z-10 h-[40vh] w-[40vw] bg-[radial-gradient(circle,rgba(123,30,58,0.4),transparent_70%)] blur-3xl" />
      <div className="absolute -right-10 bottom-0 -z-10 h-[40vh] w-[40vw] bg-[radial-gradient(circle,rgba(90,24,154,0.4),transparent_70%)] blur-3xl" />

      <div className="container-wide">
        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-7">
            <div className="section-label">Register · Take your spot</div>
            <h2 className="display-serif mt-5 text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.95] tracking-tight text-cream">
              A few short steps and we’ll save you a spot in the{' '}
              <span className="gold-text-gradient italic">circle.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-cream/65">
              One simple sign-up for the month — $60 for all four Tuesdays. Sign-ups
              are final and classes are sold by the month, so come ready to dance.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-8">
          {/* MAIN FORM */}
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-[28px] border border-cream/10 bg-gradient-to-br from-cream/[0.04] to-cream/[0.01] p-6 md:p-10">
              <Stepper step={step} />

              <div className="mt-10 min-h-[440px]">
                <AnimatePresence mode="wait">
                  {/* STEP 1 — WORKSHOP */}
                  {step === 0 && (
                    <motion.div
                      key="ws"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="display-serif text-2xl font-medium text-cream md:text-3xl">
                        Which batch are you joining?
                      </h3>
                      <p className="mt-1 text-sm text-cream/55">
                        Same class every Tuesday, 7:30 – 9:30 PM. Pick your month —
                        you can switch any time before payment.
                      </p>
                      <div className="mt-7 grid gap-3">
                        {WORKSHOPS.map((w) => {
                          const selected = data.workshop === w.id
                          return (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => set('workshop', w.id)}
                              className={`group flex items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-all ${
                                selected
                                  ? 'border-gold/60 bg-gradient-to-r from-gold/10 to-transparent shadow-[0_0_0_4px_rgba(244,185,66,0.08)]'
                                  : 'border-cream/10 bg-cream/[0.03] hover:border-cream/30 hover:bg-cream/[0.06]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span
                                  className="grid h-12 w-12 place-items-center rounded-xl text-navy-900 font-display text-lg font-bold"
                                  style={{
                                    background: `linear-gradient(135deg, ${w.color}, #7B1E3A)`,
                                  }}
                                >
                                  {w.name.charAt(0)}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="display-serif text-lg leading-tight text-cream">
                                      {w.name}
                                    </p>
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.2em] ${
                                        w.tag === 'Open now'
                                          ? 'bg-gold/15 text-gold'
                                          : 'border border-cream/15 text-cream/50'
                                      }`}
                                    >
                                      {w.tag}
                                    </span>
                                  </div>
                                  <p className="text-xs uppercase tracking-[0.28em] text-cream/55">
                                    {w.date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className="display-serif text-xl text-cream">
                                  ${w.price.toLocaleString('en-US')}
                                </p>
                                <span
                                  className={`grid h-6 w-6 place-items-center rounded-full border ${
                                    selected
                                      ? 'border-gold bg-gold text-navy-900'
                                      : 'border-cream/30'
                                  }`}
                                >
                                  {selected && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                      <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 — LEVEL */}
                  {step === 1 && (
                    <motion.div
                      key="lv"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.45 }}
                    >
                      <h3 className="display-serif text-2xl font-medium text-cream md:text-3xl">
                        How would you describe yourself?
                      </h3>
                      <p className="mt-1 text-sm text-cream/55">
                        There is no wrong answer. We’ll group you with similar dancers.
                      </p>
                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {LEVELS.map((l) => {
                          const sel = data.level === l.id
                          return (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => set('level', l.id)}
                              className={`rounded-2xl border p-5 text-left transition-all ${
                                sel
                                  ? 'border-gold/60 bg-gradient-to-br from-gold/10 to-transparent shadow-[0_0_0_4px_rgba(244,185,66,0.08)]'
                                  : 'border-cream/10 bg-cream/[0.03] hover:border-cream/30'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="display-serif text-xl text-cream">{l.title}</span>
                                <span
                                  className={`grid h-6 w-6 place-items-center rounded-full border ${
                                    sel ? 'border-gold bg-gold text-navy-900' : 'border-cream/30'
                                  }`}
                                >
                                  {sel && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                      <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-cream/60">{l.sub}</p>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 — DETAILS */}
                  {step === 2 && (
                    <motion.div
                      key="dt"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.45 }}
                    >
                      <h3 className="display-serif text-2xl font-medium text-cream md:text-3xl">
                        Tell us about you.
                      </h3>
                      <p className="mt-1 text-sm text-cream/55">
                        We’ll send updates only about your sessions. Promise.
                      </p>

                      <div className="mt-7 grid gap-5 md:grid-cols-2">
                        <Field label="Full name">
                          <input
                            className={inputCls}
                            placeholder="e.g. Ankita Patel"
                            value={data.fullName}
                            onChange={(e) => set('fullName', e.target.value)}
                          />
                        </Field>
                        <Field label="Email">
                          <input
                            type="email"
                            className={inputCls}
                            placeholder="you@inbox.com"
                            value={data.email}
                            onChange={(e) => set('email', e.target.value)}
                          />
                        </Field>
                        <Field label="Phone">
                          <input
                            className={inputCls}
                            placeholder="(630) 555-0142"
                            value={data.phone}
                            onChange={(e) => set('phone', e.target.value)}
                          />
                        </Field>
                        <Field label="Age group">
                          <div className="flex flex-wrap gap-2">
                            {AGE_GROUPS.map((a) => (
                              <button
                                key={a}
                                type="button"
                                onClick={() => set('age', a)}
                                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                                  data.age === a
                                    ? 'border-gold bg-gold/15 text-gold'
                                    : 'border-cream/15 text-cream/70 hover:border-cream/30'
                                }`}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="Emergency contact" hint="Name and phone — just in case.">
                          <input
                            className={inputCls}
                            placeholder="e.g. Priya · (630) 555-..."
                            value={data.emergency}
                            onChange={(e) => set('emergency', e.target.value)}
                          />
                        </Field>
                        <Field label="Notes (optional)" hint="Injuries, allergies, anything we should know.">
                          <textarea
                            className={`${inputCls} min-h-[80px] resize-none`}
                            placeholder="e.g. I have a knee that doesn’t love jumping…"
                            value={data.notes}
                            onChange={(e) => set('notes', e.target.value)}
                          />
                        </Field>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4 — CODE OF CONDUCT */}
                  {step === 3 && (
                    <motion.div
                      key="cc"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.45 }}
                    >
                      <h3 className="display-serif text-2xl font-medium text-cream md:text-3xl">
                        Code of Conduct
                      </h3>
                      <p className="mt-1 text-sm text-cream/55">
                        A few house rules before we dance together. Please read and accept.
                      </p>

                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {CONDUCT.map((c, idx) => (
                          <div
                            key={c.title}
                            className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-5"
                          >
                            <div className="flex items-center gap-3">
                              <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <p className="text-sm font-semibold text-cream">{c.title}</p>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-cream/60">{c.body}</p>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => set('agreed', !data.agreed)}
                        className={`mt-7 flex w-full items-center gap-3 rounded-2xl border p-5 text-left transition ${
                          data.agreed
                            ? 'border-gold/60 bg-gold/10'
                            : 'border-cream/10 bg-cream/[0.03] hover:border-cream/30'
                        }`}
                      >
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                            data.agreed ? 'border-gold bg-gold text-navy-900' : 'border-cream/30'
                          }`}
                        >
                          {data.agreed && (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm text-cream/85">
                          I’ve read and agree to Rangtaal’s Code of Conduct — including the
                          no-refund and monthly-only policies.
                        </span>
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 5 — PAYMENT */}
                  {step === 4 && (
                    <motion.div
                      key="py"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.45 }}
                    >
                      <h3 className="display-serif text-2xl font-medium text-cream md:text-3xl">
                        Pay by Zelle.
                      </h3>
                      <p className="mt-1 text-sm text-cream/55">
                        We accept Zelle only — no card, bank transfer or cash.
                      </p>

                      <div className="mt-7 overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent p-6">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/20 text-gold">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </span>
                          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
                            Zelle
                          </p>
                        </div>
                        <p className="mt-4 text-base leading-relaxed text-cream/85">
                          Please send your <span className="text-cream font-semibold">${total} Zelle payment</span> to{' '}
                          <span className="text-cream font-semibold">Riya Shah</span> at:
                        </p>
                        <p className="display-serif mt-2 text-3xl text-cream">(630) 555-0150</p>
                        <p className="mt-3 text-xs leading-relaxed text-cream/55">
                          Add your full name in the Zelle memo so we can match your payment.
                          Your spot is confirmed once we receive it.
                        </p>
                      </div>

                      <div className="mt-6 rounded-2xl border border-cream/10 bg-cream/[0.03] p-6">
                        <div className="flex items-center justify-between text-sm text-cream/70">
                          <span>Monthly fee · 4 Tuesdays</span>
                          <span>${total.toLocaleString('en-US')}</span>
                        </div>
                        <div className="my-4 h-px bg-cream/10" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm uppercase tracking-[0.28em] text-cream/55">
                            Total
                          </span>
                          <span className="display-serif text-2xl text-cream">
                            ${grand.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-cream/45">
                        Sign-ups are final and non-refundable — you agreed to our code of
                        conduct in the previous step.
                      </p>
                    </motion.div>
                  )}

                  {/* STEP 6 — CONFIRMATION */}
                  {step === 5 && (
                    <motion.div
                      key="cf"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="relative grid h-24 w-24 place-items-center">
                        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-gold to-marigold blur-xl" />
                        <div className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-gold to-marigold text-navy-900 shadow-glow-gold">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="display-serif mt-6 text-3xl font-medium leading-tight text-cream md:text-4xl">
                        You’re in.
                      </h3>
                      <p className="mt-2 max-w-md text-cream/65">
                        We’ve sent your confirmation to <span className="text-cream">{data.email || 'your inbox'}</span>. Your reservation ID is <span className="font-mono text-gold">RT-{Math.floor(Math.random() * 90000 + 10000)}</span>.
                      </p>
                      <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3 text-left">
                        <div className="rounded-xl border border-cream/10 bg-cream/[0.04] p-4">
                          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/55">Workshop</p>
                          <p className="display-serif mt-1 text-sm text-cream">{chosenWs?.name}</p>
                        </div>
                        <div className="rounded-xl border border-cream/10 bg-cream/[0.04] p-4">
                          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/55">Starts</p>
                          <p className="display-serif mt-1 text-sm text-cream">{chosenWs?.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setData(initial)
                          setStep(0)
                        }}
                        className="btn-ghost mt-8"
                      >
                        Register someone else
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* navigation */}
              {step < 5 && (
                <div className="mt-10 flex items-center justify-between border-t border-cream/10 pt-6">
                  <button
                    type="button"
                    onClick={back}
                    disabled={step === 0}
                    className={`text-sm uppercase tracking-[0.3em] transition ${
                      step === 0 ? 'cursor-not-allowed text-cream/25' : 'text-cream/70 hover:text-cream'
                    }`}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canAdvance()}
                    className={`btn-primary !px-7 !py-3 ${!canAdvance() ? 'pointer-events-none opacity-40' : ''}`}
                  >
                    {step === 4 ? 'Confirm & Register' : 'Continue'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SIDE SUMMARY */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-28 space-y-5">
              <div className="overflow-hidden rounded-[24px] border border-cream/10 bg-gradient-to-br from-maroon/30 via-navy-800/60 to-royal/30 p-6 backdrop-blur-xl">
                <p className="text-[0.6rem] uppercase tracking-[0.32em] text-gold/90">Order summary</p>
                <p className="display-serif mt-3 text-2xl leading-tight text-cream">
                  {chosenWs ? chosenWs.name : 'Choose a batch'}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-cream/55">
                  {chosenWs ? chosenWs.date : '—'}
                </p>

                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-cream/70">
                    <span>Level</span>
                    <span className="text-cream">
                      {LEVELS.find((l) => l.id === data.level)?.title || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-cream/70">
                    <span>Dancer</span>
                    <span className="text-cream">{data.fullName || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-cream/70">
                    <span>Age group</span>
                    <span className="text-cream">{data.age || '—'}</span>
                  </div>
                </div>

                <div className="my-5 h-px bg-cream/10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.28em] text-cream/55">Total</span>
                  <span className="display-serif text-2xl text-cream">
                    ${grand.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <div className="rounded-[24px] border border-cream/10 bg-cream/[0.03] p-6">
                <div className="flex items-center gap-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z" stroke="#F4B942" strokeWidth="1.6" />
                    <circle cx="12" cy="9" r="3" stroke="#F4B942" strokeWidth="1.6" />
                  </svg>
                  <p className="text-sm font-semibold text-cream">Location</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-cream/60">
                  We’ll let you know exactly where to come once you sign up.
                </p>
              </div>

              <div className="rounded-[24px] border border-cream/10 bg-cream/[0.03] p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-cream/55">Questions?</p>
                <p className="display-serif mt-2 text-lg text-cream">WhatsApp us</p>
                <p className="mt-1 text-xs text-cream/55">(630) 555-0150 · 10am – 8pm CT</p>
                <a href="#" onClick={(e) => e.preventDefault()} className="mt-3 inline-flex items-center gap-2 text-xs text-gold hover:text-cream">
                  Open chat <span>→</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
