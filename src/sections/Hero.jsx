import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Particles from '../components/Particles.jsx'
import DandiyaMedallion from '../components/DandiyaMedallion.jsx'

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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-[#10112d] to-navy-900" />
        <div className="absolute -top-40 left-1/2 h-[60vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(123,30,58,0.55),transparent_70%)] blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(90,24,154,0.45),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(247,127,0,0.35),transparent_70%)] blur-3xl" />

        {/* ambient dandiya medallion — large, faint emblem filling the hero */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[2vw]">
          <div className="relative aspect-square w-[130%] max-w-[860px] opacity-[0.28] sm:w-[96%] lg:w-[66%]">
            {/* warm glow behind the emblem */}
            <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(244,185,66,0.16),transparent_70%)] blur-2xl" />
            {/* slow orbiting ring */}
            <motion.svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(244,185,66,0.5)" strokeWidth="0.5" strokeDasharray="3 10" />
            </motion.svg>
            {/* counter-rotating dotted ring */}
            <motion.svg
              viewBox="0 0 400 400"
              className="absolute inset-[11%] h-[78%] w-[78%]"
              animate={{ rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(255,210,122,0.55)" strokeWidth="0.4" strokeDasharray="1 6" />
            </motion.svg>
            <DandiyaMedallion className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
      <Particles count={36} />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-8 gap-y-16">
          {/* Left — text block; the medallion breathes in the open space to the right */}
          <div className="relative z-20 col-span-12 lg:col-span-8 lg:pr-6">
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
              <Link to="/workshops" className="btn-primary">
                Explore Workshops
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
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
