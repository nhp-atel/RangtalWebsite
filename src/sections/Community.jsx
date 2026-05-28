import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stories = [
  {
    word: 'Confidence',
    sub: 'You walk in nervous. You leave taking up the whole room.',
    quote:
      'I’ve loved garba for seventy-one years and never found the courage to dance it. I joined Rangtaal in 2025, terrified of making mistakes — and the surprise was that when I did, nobody minded. Everyone just helped me get better.',
    by: 'Asha · started garba at 71',
    color: '#F77F00',
    layout: 'wide',
  },
  {
    word: 'Celebration',
    sub: 'Some nights you stop dancing just to look around and laugh.',
    quote:
      'It’s the only place where strangers cheer for you for showing up.',
    by: 'Rita · returns every season',
    color: '#FF4D8D',
    layout: 'short',
  },
  {
    word: 'Community',
    sub: 'A circle, by definition, has no head and no tail.',
    quote:
      'I moved here from Houston last year and didn’t know a soul. Rangtaal became my family — I found my people here. Even after Navratri, we still hang out every weekend.',
    by: 'Eshaan · moved from Houston',
    color: '#5A189A',
    layout: 'wide',
  },
  {
    word: 'Fitness',
    sub: '900 calories, a soundtrack, and not once does it feel like exercise.',
    quote:
      'Every Tuesday I skip my cardio and come to garba class instead — I get my steps in and soak up the music and the vibes.',
    by: 'Arpan · trades the gym for garba',
    color: '#7B1E3A',
    layout: 'short',
  },
  {
    word: 'Friendships',
    sub: 'The best part of the circle isn’t the dancing — it’s the people you meet along the way.',
    quote:
      'I’ve been Nik’s very first student since 2023. Every time he comes up with a new step, I’m usually the one learning it first. He never lets me leave until I get it right. What started as a dance class became something much more. Through Rangtaal, I found friendships, confidence, and a community I genuinely look forward to being part of.',
    by: 'Nimesh · Nik’s first student, since 2023',
    color: '#FFD27A',
    layout: 'full',
  },
]

function StoryCard({ s, i }) {
  const isEven = i % 2 === 0
  const isFull = s.layout === 'full'
  const sizes = {
    wide: 'lg:col-span-8',
    tall: 'lg:col-span-5 lg:row-span-2',
    short: 'lg:col-span-4',
    full: 'lg:col-span-12',
  }
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative col-span-12 ${sizes[s.layout]} group`}
    >
      <div
        className="relative h-full overflow-hidden rounded-[28px] border border-cream/10 p-7 md:p-10"
        style={{
          background: `linear-gradient(135deg, rgba(255,248,231,0.04), rgba(255,248,231,0.01)), radial-gradient(circle at ${isEven ? '0% 0%' : '100% 100%'}, ${s.color}25, transparent 60%)`,
        }}
      >
        {/* large faint number */}
        <div
          className="display-serif absolute right-6 top-6 select-none text-7xl font-light leading-none"
          style={{ color: `${s.color}30` }}
        >
          {String(i + 1).padStart(2, '0')}
        </div>

        {/* color blob */}
        <div
          className="pointer-events-none absolute -bottom-12 -right-10 h-48 w-48 rounded-full blur-3xl opacity-50"
          style={{ background: s.color }}
        />

        <div className={`relative flex h-full flex-col ${isFull ? 'lg:flex-row lg:items-end lg:gap-16' : ''}`}>
          <div className={isFull ? 'lg:flex-1' : ''}>
            <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-cream/55">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 14px ${s.color}` }}
              />
              Why we dance · 0{i + 1}
            </div>

            <h3 className="display-serif mt-5 text-[clamp(2.4rem,4.5vw,4.4rem)] font-medium leading-[0.95] tracking-tight text-cream">
              {s.word}
              <span className="inline-block align-top text-xl" style={{ color: s.color }}>.</span>
            </h3>

            <p className="mt-3 max-w-md text-base leading-relaxed text-cream/70">
              {s.sub}
            </p>
          </div>

          {/* quote */}
          <blockquote className={isFull ? 'pt-8 lg:flex-1 lg:pt-0' : 'mt-auto pt-8'}>
            <p className="relative pl-6 text-base italic leading-relaxed text-cream/85">
              <span
                className="absolute left-0 top-0 display-serif text-3xl leading-none"
                style={{ color: s.color }}
              >
                “
              </span>
              {s.quote}
            </p>
            <footer className="mt-3 flex items-center gap-3">
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-navy-900"
                style={{ background: `linear-gradient(135deg, ${s.color}, #7B1E3A)` }}
              >
                {s.by.charAt(0)}
              </div>
              <span className="text-xs uppercase tracking-[0.28em] text-cream/55">{s.by}</span>
            </footer>
          </blockquote>
        </div>

        {/* hover ring */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] border opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ borderColor: `${s.color}80` }}
        />
      </div>
    </motion.article>
  )
}

export default function Community() {
  return (
    <section id="community" className="relative isolate overflow-hidden pt-32 pb-20 sm:py-28">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-[#0c0a1f] to-navy-900" />
      <div className="absolute top-0 left-1/2 -z-10 h-[60vh] w-[100vw] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(123,30,58,0.3),transparent_70%)] blur-3xl" />

      <div className="container-wide">
        {/* asymmetric header */}
        <div className="grid grid-cols-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <div className="section-label">Community · Why we dance</div>
            <h2 className="display-serif mt-5 text-balance text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[1.04] tracking-tight text-cream">
              Echoes from{' '}
              <span className="gold-text-gradient italic inline-block pb-2 pr-1">last Navratri</span>.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pl-8">
            <p className="text-base leading-relaxed text-cream/70">
              A few reasons our community shows up — in their own words. None of these
              are about being a great dancer. The dance, somehow, takes care of itself.
            </p>
          </div>
        </div>

        {/* Storytelling grid — varied row heights */}
        <div className="mt-16 grid grid-cols-12 gap-5 lg:grid-flow-row-dense">
          {stories.map((s, i) => (
            <StoryCard key={s.word} s={s} i={i} />
          ))}
        </div>

        {/* CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-16 overflow-hidden rounded-[28px] border border-cream/10 bg-gradient-to-r from-maroon/30 via-navy-800/60 to-royal/30 p-8 md:p-12"
        >
          <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="text-[0.65rem] uppercase tracking-[0.4em] text-gold/90">
                Now enrolling · July & August
              </div>
              <h3 className="display-serif mt-3 text-2xl leading-tight text-cream md:text-3xl">
                Join the circle — every Tuesday, 7:30 PM. Just $60 for the month.
              </h3>
            </div>
            <Link to="/register" className="btn-primary whitespace-nowrap">
              Reserve a Spot
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
