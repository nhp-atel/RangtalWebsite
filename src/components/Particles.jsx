import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export default function Particles({ count = 30, palette = ['#F4B942', '#F77F00', '#FF4D8D', '#FFF8E7'] }) {
  // Render roughly half the particles on small screens — saves the GPU work
  // for less return on phones, where particles are already small specks.
  const [effectiveCount, setEffectiveCount] = useState(count)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (reduced.matches) setEffectiveCount(0)
      else setEffectiveCount(mq.matches ? Math.ceil(count * 0.4) : count)
    }
    update()
    mq.addEventListener?.('change', update)
    reduced.addEventListener?.('change', update)
    return () => {
      mq.removeEventListener?.('change', update)
      reduced.removeEventListener?.('change', update)
    }
  }, [count])

  const items = useMemo(
    () =>
      Array.from({ length: effectiveCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 4,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 10,
        amp: 18 + Math.random() * 30,
        hue: palette[i % palette.length],
      })),
    [effectiveCount, palette]
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 ${p.size * 4}px ${p.hue}`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -p.amp, 0], opacity: [0, 0.85, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
