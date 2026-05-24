import { motion } from 'framer-motion'
import Particles from '../components/Particles.jsx'
import HeroArtwork from '../components/HeroArtwork.jsx'

const marqueeWords = [
  'Garba',
  'Raas',
  'Dandiya',
  'Navratri',
  'Rhythm',
  'Tradition',
  'Community',
  'Celebration',
  'Heritage',
  'Energy',
]

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      {/* atmospheric backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-[#10112d] to-navy-900" />
        <div className="absolute -top-40 left-1/2 h-[60vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(123,30,58,0.55),transparent_70%)] blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(90,24,154,0.45),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(247,127,0,0.35),transparent_70%)] blur-3xl" />
      </div>
      <Particles count={36} />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-8 gap-y-16">
          {/* Left — text block, anchored off-grid */}
          <div className="relative z-20 col-span-12 lg:col-span-7 lg:pr-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="section-label"
            >
              Navratri 2026 · Season Live
            </motion.div>

            <div className="mt-6">
              <h1 className="display-serif text-[clamp(2.8rem,7.2vw,6.4rem)] font-medium leading-[0.95] tracking-tight text-cream">
                <motion.span
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  Where{' '}
                  <span className="relative inline-block">
                    <span className="gold-text-gradient italic">Rhythm</span>
                    <svg
                      className="absolute -bottom-2 left-0 h-3 w-full"
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d="M2 8 Q 50 2 100 6 T 198 5"
                        fill="none"
                        stroke="#F4B942"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.4, duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                  </span>
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  Meets <span className="text-cream/95">Tradition.</span>
                </motion.span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-cream/70"
            >
              Learn Garba, Raas, and Dandiya through energetic workshops, cultural
              experiences, and community celebrations — built for dancers who want
              to feel the festival, not just attend it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a href="#workshops" className="btn-primary">
                Join Workshops
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#countdown" className="btn-ghost">
                <span className="relative grid h-2 w-2 place-items-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-gold/70" />
                  <span className="h-2 w-2 rounded-full bg-gold" />
                </span>
                Upcoming Events
              </a>
            </motion.div>

            {/* Trust strip / proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55, duration: 0.8 }}
              className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6"
            >
              <div>
                <div className="display-serif text-4xl font-medium text-cream">
                  150<span className="text-gold">+</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-cream/55">
                  Dancers in our circle
                </p>
              </div>
              <div className="h-10 w-px bg-cream/15" />
              <div>
                <div className="display-serif text-4xl font-medium text-cream">
                  8
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-cream/55">
                  Passionate instructors
                </p>
              </div>
              <div className="h-10 w-px bg-cream/15" />
              <div>
                <div className="display-serif text-4xl font-medium text-cream">
                  Every Tue
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-cream/55">
                  7:30 – 9:30 PM CT
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — layered artwork stack */}
          <div className="relative col-span-12 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-[5/6] w-full max-w-[520px] lg:absolute lg:-top-10 lg:right-0 lg:max-w-[600px]"
            >
              {/* glowing halo */}
              <div className="absolute -inset-10 rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(244,185,66,0.25),transparent_70%)] blur-2xl" />

              {/* artwork plate */}
              <div className="relative h-full w-full">
                <HeroArtwork />

                {/* tiny rotating dandiya badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.7 }}
                  className="absolute -bottom-6 right-10 h-24 w-24 rounded-full bg-navy-900/80 backdrop-blur-md border border-gold/40"
                >
                  <div className="absolute inset-2 rounded-full border border-gold/20" />
                  <motion.div
                    className="absolute inset-0 grid place-items-center text-[9px] font-semibold uppercase tracking-[0.3em] text-gold"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                  >
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <defs>
                        <path id="circ" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
                      </defs>
                      <text fill="currentColor" fontSize="9" letterSpacing="3">
                        <textPath href="#circ">
                          · feel the rhythm · feel the rhythm
                        </textPath>
                      </text>
                    </svg>
                  </motion.div>
                  <div className="absolute inset-0 grid place-items-center">
                    <svg width="34" height="34" viewBox="0 0 40 40">
                      <g stroke="#F4B942" strokeWidth="2.4" strokeLinecap="round">
                        <line x1="10" y1="10" x2="30" y2="30" />
                        <line x1="30" y1="10" x2="10" y2="30" />
                      </g>
                      <circle cx="20" cy="20" r="3" fill="#F4B942" />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom marquee — never ending word chant */}
      <div className="relative mt-20 lg:mt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-transparent to-navy-900 z-10 pointer-events-none" />
        <div className="overflow-hidden border-y border-cream/10 py-6">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
              <span
                key={i}
                className="display-serif text-4xl font-light tracking-tight text-cream/40 md:text-5xl"
              >
                {w}
                <span className="ml-12 inline-block translate-y-[-6px] text-gold/60">✦</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
