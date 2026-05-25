import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen({ onDone }) {
  const [done, setDone] = useState(false)

  const particles = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 20 + Math.random() * 70,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        hue: ['#F4B942', '#F77F00', '#FF4D8D', '#FFF8E7'][i % 4],
      })),
    []
  )

  useEffect(() => {
    const MIN = 600 // brief minimum so the brand registers without flashing
    const MAX = 1400 // hard cap — never make people wait longer than this
    const FADE = 400
    const start = performance.now()
    let finished = false
    const timers = []

    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN - (performance.now() - start))
      timers.push(setTimeout(() => setDone(true), wait))
      timers.push(setTimeout(() => onDone?.(), wait + FADE))
    }

    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    timers.push(setTimeout(finish, MAX))

    return () => {
      window.removeEventListener('load', finish)
      timers.forEach(clearTimeout)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-navy-900"
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* warm ambient gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(247,127,0,0.22),transparent_60%)]" />
        <div className="absolute -bottom-40 left-1/2 h-[60vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(123,30,58,0.55),transparent_70%)] blur-3xl" />
        <div className="absolute -top-40 right-0 h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(90,24,154,0.45),transparent_70%)] blur-3xl" />
      </div>

      {/* festive floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.hue,
              boxShadow: `0 0 12px ${p.hue}`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [-10, -40, -10], opacity: [0, 0.9, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* central brand badge */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="relative grid place-items-center">
          {/* outer halo */}
          <motion.div
            className="absolute inset-0 -m-20 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(244,185,66,0.45) 0%, rgba(247,127,0,0.25) 30%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* expanding rings (aarti light) */}
          {[0, 0.6, 1.2].map((delay, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border border-gold/50"
              initial={{ width: 180, height: 180, opacity: 0 }}
              animate={{ width: 420, height: 420, opacity: [0, 0.6, 0] }}
              transition={{ duration: 2.4, delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}

          {/* orbital dots */}
          <motion.div
            className="absolute inset-0 -m-12"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-130px)`,
                  background: ['#F4B942', '#F77F00', '#FF4D8D', '#FFD27A', '#5A189A', '#F4B942'][i],
                  boxShadow: `0 0 12px ${['#F4B942', '#F77F00', '#FF4D8D', '#FFD27A', '#5A189A', '#F4B942'][i]}`,
                }}
              />
            ))}
          </motion.div>

          {/* counter-rotating dashed ring */}
          <motion.svg
            viewBox="0 0 240 240"
            className="absolute h-[260px] w-[260px]"
            animate={{ rotate: -360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="120"
              cy="120"
              r="118"
              fill="none"
              stroke="rgba(244,185,66,0.35)"
              strokeWidth="0.8"
              strokeDasharray="2 8"
            />
          </motion.svg>

          {/* the logo itself */}
          <motion.img
            src="/logo.png"
            alt="Rangtaal — feel the rhythm of garba"
            initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[180px] w-[180px] rounded-full object-cover shadow-[0_20px_60px_-10px_rgba(247,127,0,0.6)] sm:h-[210px] sm:w-[210px]"
            draggable="false"
            fetchpriority="high"
          />
        </div>

        {/* Tagline + loading bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.48em] text-cream/75">
            Feel the Rhythm of Garba
          </p>

          {/* shimmer loading bar */}
          <div className="mt-7 h-[2px] w-44 overflow-hidden rounded-full bg-cream/10">
            <motion.div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-gold via-marigold to-pinkglow"
              initial={{ x: '-100%' }}
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
