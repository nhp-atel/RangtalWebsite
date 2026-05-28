import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Particles from '../components/Particles.jsx'

// Sharad Navratri 2026 — Oct 11, 2026, 6:30 PM Central (CDT, UTC-5)
const TARGET = new Date('2026-10-11T18:30:00-05:00')

function useCountdown(target) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(i)
  }, [])
  const diff = Math.max(0, target.getTime() - now.getTime())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function Digit({ value, label }) {
  const formatted = String(value).padStart(2, '0')
  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="relative overflow-hidden">
        <div className="display-serif relative flex items-end text-[clamp(2.4rem,11vw,8rem)] font-medium leading-none tracking-tighter text-cream">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={formatted}
              initial={{ y: '-100%', opacity: 0, rotateX: -60 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: '100%', opacity: 0, rotateX: 60 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block bg-gradient-to-b from-cream via-gold to-marigold bg-clip-text text-transparent"
              style={{ transformOrigin: 'center', backfaceVisibility: 'hidden' }}
            >
              {formatted}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="mt-2 text-[0.65rem] uppercase tracking-[0.42em] text-cream/55">
        {label}
      </span>
    </div>
  )
}

function HangingLights() {
  const bulbs = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        color: ['#F4B942', '#F77F00', '#FF4D8D', '#FFD27A', '#5A189A'][i % 5],
        delay: Math.random() * 2,
      })),
    []
  )
  return (
    <svg
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 -top-4 h-32 w-full opacity-95"
    >
      {/* wire */}
      <path
        d="M0 30 Q 360 100 720 30 T 1440 30"
        stroke="#FFF8E7"
        strokeOpacity="0.25"
        strokeWidth="1"
        fill="none"
      />
      {bulbs.map((b, i) => {
        const t = i / (bulbs.length - 1)
        const x = t * 1440
        // matching the quadratic above
        const y =
          30 +
          (Math.abs(Math.sin(t * Math.PI * 2)) * 0 +
            Math.sin(t * Math.PI) * 70)
        return (
          <g key={b.id}>
            <line x1={x} y1={y - 6} x2={x} y2={y - 18} stroke="#FFF8E7" strokeOpacity="0.3" strokeWidth="0.6" />
            <motion.circle
              cx={x}
              cy={y}
              r="6"
              fill={b.color}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: b.delay }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="16"
              fill={b.color}
              opacity="0.35"
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: b.delay }}
            />
          </g>
        )
      })}
    </svg>
  )
}

function CrowdSilhouette() {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-44 w-full"
    >
      <defs>
        <linearGradient id="crowdFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0B132B" stopOpacity="0" />
          <stop offset="60%" stopColor="#0B132B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06091A" />
        </linearGradient>
      </defs>
      <rect width="1440" height="200" fill="url(#crowdFade)" />
      {/* back row of heads */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = i * 38 + (i % 2 === 0 ? 0 : 18)
        return (
          <g key={`back-${i}`} opacity="0.7">
            <circle cx={x} cy="150" r="10" fill="#06091A" />
            <rect x={x - 12} y="160" width="24" height="40" fill="#06091A" />
          </g>
        )
      })}
      {/* front row — bigger */}
      {Array.from({ length: 26 }).map((_, i) => {
        const x = i * 58 + 20
        return (
          <g key={`front-${i}`}>
            <circle cx={x} cy="170" r="14" fill="#000" />
            <rect x={x - 18} y="184" width="36" height="40" fill="#000" />
            {/* raised hand with stick on some */}
            {i % 3 === 0 && (
              <g stroke="#000" strokeWidth="4" strokeLinecap="round">
                <line x1={x - 16} y1="180" x2={x - 22} y2="155" />
                <line x1={x - 22} y1="155" x2={x - 26} y2="120" stroke="#F4B942" strokeWidth="2.4" />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET)

  return (
    <section id="countdown" className="relative isolate overflow-hidden pt-32 pb-20 sm:py-28">
      {/* base */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-[#1a0b30] via-50% to-[#3E1071]" />
      {/* warm sun behind */}
      <div className="absolute left-1/2 top-1/4 -z-10 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,185,66,0.4),rgba(247,127,0,0.25)_30%,transparent_60%)] blur-3xl" />
      <div className="absolute -right-20 bottom-0 -z-10 h-[40vh] w-[50vw] bg-[radial-gradient(circle,rgba(255,77,141,0.3),transparent_70%)] blur-3xl" />

      {/* hanging lights along the top */}
      <HangingLights />

      {/* festive floating particles */}
      <Particles count={40} />

      <div className="container-wide relative pt-16 sm:pt-24">
        <div className="grid grid-cols-12 items-end gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <div className="section-label">Navratri 2026 · Sharad</div>
            <h2 className="display-serif mt-5 text-[clamp(2.6rem,6vw,5.6rem)] font-medium leading-[0.95] tracking-tight text-cream">
              Navratri begins in
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-base leading-relaxed text-cream/70">
              The 2026 Navratri will be from Oct 11 to Oct 19.
            </p>
          </div>
        </div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9 }}
          className="relative mt-16"
        >
          <div className="relative overflow-hidden rounded-[24px] border border-cream/15 bg-gradient-to-br from-black/30 via-navy-900/40 to-black/30 px-4 py-10 backdrop-blur-xl sm:rounded-[28px] sm:px-6 sm:py-14 md:px-16 md:py-20">
            {/* ornate corner */}
            <div className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-gold/60 sm:left-6 sm:top-6 sm:h-12 sm:w-12" />
            <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-gold/60 sm:right-6 sm:top-6 sm:h-12 sm:w-12" />
            <div className="pointer-events-none absolute left-4 bottom-4 h-8 w-8 border-l-2 border-b-2 border-gold/60 sm:left-6 sm:bottom-6 sm:h-12 sm:w-12" />
            <div className="pointer-events-none absolute right-4 bottom-4 h-8 w-8 border-r-2 border-b-2 border-gold/60 sm:right-6 sm:bottom-6 sm:h-12 sm:w-12" />

            <div className="grid grid-cols-4 items-end gap-2 sm:gap-4 md:gap-8">
              <Digit value={days} label="Days" />
              <div className="display-serif hidden self-end pb-6 text-5xl text-gold/40 md:block">
                :
              </div>
              <Digit value={hours} label="Hours" />
              <div className="display-serif hidden self-end pb-6 text-5xl text-gold/40 md:block">
                :
              </div>
              <Digit value={minutes} label="Minutes" />
              <div className="display-serif hidden self-end pb-6 text-5xl text-gold/40 md:block">
                :
              </div>
              <Digit value={seconds} label="Seconds" />
            </div>

            <div className="mt-12 border-t border-cream/10 pt-8 text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-gold/80">
                Sharad Navratri · 9 Nights
              </p>
              <p className="display-serif mt-2 text-xl text-cream md:text-2xl">
                Oct 11 — Oct 19, 2026 · Gates 6:30 PM
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* crowd silhouette */}
      <CrowdSilhouette />
    </section>
  )
}
