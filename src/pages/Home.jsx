import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../sections/Hero.jsx'

const explore = [
  {
    to: '/workshops',
    kicker: 'Workshops',
    title: 'Join the circle',
    blurb: 'One class, every Tuesday, 7:30–9:30 PM. July & August open now — all levels, $60 for the month.',
    palette: 'from-[#5A189A] via-[#7B2CBF] to-[#FF4D8D]',
  },
  {
    to: '/events',
    kicker: 'Events',
    title: 'Navratri 2026',
    blurb: 'Nine nights of pure rhythm. Watch the countdown to the biggest Garba season of the year.',
    palette: 'from-[#0B132B] via-[#5A189A] to-[#F4B942]',
  },
  {
    to: '/gallery',
    kicker: 'Gallery',
    title: 'Moments & reels',
    blurb: 'Festival nights, rehearsals and the whole circle — a scrapbook from the community.',
    palette: 'from-[#7B1E3A] via-[#9B2A4C] to-[#F77F00]',
  },
  {
    to: '/about',
    kicker: 'About',
    title: 'Our story',
    blurb: 'How Rangtaal started in a Schaumburg warehouse — and why people keep coming back.',
    palette: 'from-[#FF4D8D] via-[#7B1E3A] to-[#5A189A]',
  },
]

export default function Home() {
  return (
    <>
      <Hero />

      {/* Explore — concise routing teaser */}
      <section className="relative isolate overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-[#0b0a1e] to-navy-900" />
        <div className="absolute bottom-0 right-0 -z-10 h-[40vh] w-[40vw] bg-[radial-gradient(circle,rgba(90,24,154,0.3),transparent_70%)] blur-3xl" />

        <div className="container-wide">
          <div className="grid grid-cols-12 items-end gap-8">
            <div className="col-span-12 lg:col-span-7">
              <div className="section-label">Explore Rangtaal</div>
              <h2 className="display-serif mt-5 text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[0.95] tracking-tight text-cream">
                Wherever you want to <span className="gold-text-gradient italic">go</span> next.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <p className="text-sm leading-relaxed text-cream/60">
                Pick a thread and dive in — the workshop, the festival, the photos, or the
                story behind it all.
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {explore.map((c, i) => (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={c.to}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-cream/10 bg-gradient-to-br ${c.palette} p-7 transition-transform duration-300 hover:-translate-y-1 md:p-9`}
                >
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="relative">
                    <p className="text-[0.62rem] uppercase tracking-[0.4em] text-cream/80">
                      {c.kicker}
                    </p>
                    <h3 className="display-serif mt-3 text-2xl leading-tight text-cream md:text-3xl">
                      {c.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/80">
                      {c.blurb}
                    </p>
                  </div>
                  <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-cream">
                    Explore
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* register band */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mt-14 overflow-hidden rounded-[28px] border border-cream/10 bg-gradient-to-r from-maroon/30 via-navy-800/60 to-royal/30 p-8 md:p-10"
          >
            <div className="absolute -right-16 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="text-[0.65rem] uppercase tracking-[0.4em] text-gold/90">
                  July & August · open now
                </div>
                <h3 className="display-serif mt-3 text-2xl leading-tight text-cream md:text-3xl">
                  Ready to dance? Save your spot in the circle.
                </h3>
              </div>
              <Link to="/register" className="btn-primary whitespace-nowrap">
                Register Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
