import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function Particles({ count = 30, palette = ['#F4B942', '#F77F00', '#FF4D8D', '#FFF8E7'] }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 4,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 10,
        amp: 18 + Math.random() * 30,
        hue: palette[i % palette.length],
      })),
    [count, palette]
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
