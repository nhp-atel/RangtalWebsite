import { motion } from 'framer-motion'

// One class — every Tuesday, 7:30–9:30 PM. Currently just the June batch.
const SCHEDULE = 'Every Tuesday · 7:30 – 9:30 PM'

const workshops = [
  {
    id: 'june',
    n: '01',
    title: 'June Batch',
    status: 'open',
    start: 'Starts June 2',
    schedule: SCHEDULE,
    theme: 'Rhythm & Footwork',
    blurb:
      'Our open batch right now. We build the rhythm into your feet — taali-chutki, faster tempos, and the confidence to dance without counting in your head. Beginners and returning dancers equally welcome.',
    palette: 'from-[#5A189A] via-[#7B2CBF] to-[#FF4D8D]',
    accent: '#7B2CBF',
    motif: 'sticks',
  },
]

const featured = workshops.find((w) => w.status === 'open')

// Preselect a batch in the registration flow and scroll to it.
function selectBatch(id) {
  window.dispatchEvent(new CustomEvent('rangtaal:selectBatch', { detail: id }))
  const el = document.getElementById('register')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function Motif({ name, color = '#F4B942' }) {
  if (name === 'lotus')
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <g fill="none" stroke={color} strokeWidth="1.4" opacity="0.85">
          {[...Array(8)].map((_, i) => {
            const a = (i * 360) / 8
            return (
              <ellipse key={i} cx="60" cy="36" rx="14" ry="32" transform={`rotate(${a} 60 60)`} />
            )
          })}
          <circle cx="60" cy="60" r="6" fill={color} opacity="0.5" />
        </g>
      </svg>
    )
  if (name === 'sticks')
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <g stroke={color} strokeWidth="3" strokeLinecap="round">
          <line x1="30" y1="30" x2="90" y2="90" />
          <line x1="90" y1="30" x2="30" y2="90" />
        </g>
        <circle cx="60" cy="60" r="5" fill={color} />
        <g stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
          <line x1="60" y1="44" x2="60" y2="36" />
          <line x1="60" y1="76" x2="60" y2="84" />
          <line x1="44" y1="60" x2="36" y2="60" />
          <line x1="76" y1="60" x2="84" y2="60" />
        </g>
      </svg>
    )
  if (name === 'crown')
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <g fill="none" stroke={color} strokeWidth="1.6">
          <path d="M20 80 L 30 50 L 50 70 L 60 40 L 70 70 L 90 50 L 100 80 Z" />
          <line x1="20" y1="88" x2="100" y2="88" />
        </g>
        {[30, 60, 90].map((x, i) => (
          <circle key={i} cx={x} cy="50" r="3" fill={color} />
        ))}
      </svg>
    )
  if (name === 'star')
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <g fill="none" stroke={color} strokeWidth="1.4">
          {[...Array(12)].map((_, i) => {
            const a = (i * 360) / 12
            return (
              <line
                key={i}
                x1="60"
                y1="60"
                x2={60 + Math.cos((a * Math.PI) / 180) * 46}
                y2={60 + Math.sin((a * Math.PI) / 180) * 46}
              />
            )
          })}
          <circle cx="60" cy="60" r="22" />
          <circle cx="60" cy="60" r="12" fill={color} fillOpacity="0.25" />
        </g>
      </svg>
    )
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full">
      <g fill="none" stroke={color} strokeWidth="1.6">
        <path d="M60 92 C 30 70, 18 50, 30 36 C 42 24, 56 34, 60 46 C 64 34, 78 24, 90 36 C 102 50, 90 70, 60 92 Z" />
      </g>
    </svg>
  )
}

/* The featured (open) batch — full immersive composition. */
function FeaturedBatch({ ws }) {
  return (
    <div className="relative grid grid-cols-12 items-center gap-x-6 gap-y-8">
      {/* IMAGE / VISUAL */}
      <motion.div
        initial={{ opacity: 0, y: 40, x: -30 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative col-span-12 lg:col-span-6 lg:col-start-1"
      >
        <div
          className={`relative aspect-[5/4] w-full overflow-hidden rounded-[28px] bg-gradient-to-br ${ws.palette} shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]`}
        >
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute -right-10 -top-10 h-72 w-72 opacity-60 mix-blend-screen">
            <Motif name={ws.motif} color="#FFF8E7" />
          </div>
          <div className="absolute -bottom-16 -left-10 h-80 w-80 opacity-30">
            <Motif name={ws.motif} color={ws.accent} />
          </div>

          {/* Open now pill */}
          <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.32em] text-gold backdrop-blur-md">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-gold/70" />
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
            Open now
          </div>

          <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-black/40 p-4 backdrop-blur-md">
            <p className="display-serif text-2xl leading-tight text-cream">{ws.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-cream/70">{ws.schedule}</p>
          </div>
        </div>

        {/* floating theme tag */}
        <div className="absolute -right-6 top-10 hidden md:block">
          <div className="rotate-[-6deg] rounded-xl border border-cream/15 bg-navy-900/85 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cream backdrop-blur-md shadow-glow-maroon">
            {ws.theme}
          </div>
        </div>
      </motion.div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40, x: 30 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative col-span-12 lg:col-span-5 lg:col-start-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.3em] text-gold">
          Next batch · open for sign-ups
        </div>
        <div className="mt-4 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-gold/90">
          <span className="h-px w-10 bg-gold/70" /> {ws.start}
        </div>
        <h3 className="display-serif mt-3 text-4xl font-medium text-cream md:text-5xl">
          {ws.title}
        </h3>
        <p className="mt-2 text-sm text-cream/55">{ws.schedule} · {ws.theme}</p>
        <p className="mt-5 max-w-md text-base leading-relaxed text-cream/75">{ws.blurb}</p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="display-serif text-3xl font-medium text-cream">$60</span>
          <span className="text-xs uppercase tracking-[0.28em] text-cream/55">/ month · 4 Tuesdays</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button onClick={() => selectBatch(ws.id)} className="btn-primary">
            Reserve your spot
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-xs uppercase tracking-[0.28em] text-cream/45">
            All levels welcome
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default function Workshops() {
  return (
    <section id="workshops" className="relative isolate overflow-hidden py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-[#0a0c1e] to-navy-900" />
      <div className="absolute top-1/3 left-0 h-[40vh] w-[40vw] -z-10 bg-[radial-gradient(circle,rgba(123,30,58,0.35),transparent_70%)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[40vh] w-[40vw] -z-10 bg-[radial-gradient(circle,rgba(90,24,154,0.35),transparent_70%)] blur-3xl" />

      <div className="container-wide">
        {/* Section header */}
        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-7">
            <div className="section-label">Workshops · 2026 Season</div>
            <h2 className="display-serif mt-5 text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[0.95] tracking-tight text-cream">
              One class, every <span className="gold-text-gradient italic">Tuesday</span>.
              <br /> A whole season of rhythm.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-base leading-relaxed text-cream/65">
              The <span className="text-cream">June batch is open</span> — one class,
              every Tuesday, 7:30 to 9:30 PM. Beginners and seasoned dancers share the
              same circle. Just $60 for the month.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em]">
              <span className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-gold">June · open</span>
              <span className="rounded-full border border-cream/15 px-3 py-1 text-cream/55">$60 / month</span>
              <span className="rounded-full border border-cream/15 px-3 py-1 text-cream/55">All levels</span>
            </div>
          </div>
        </div>

        {/* Featured open batch */}
        <div className="relative mt-20">
          <FeaturedBatch ws={featured} />
        </div>
      </div>
    </section>
  )
}
