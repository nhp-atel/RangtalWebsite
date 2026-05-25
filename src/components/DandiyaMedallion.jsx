import { motion } from 'framer-motion'

/* Bespoke garba motif: two crossed dandiya sticks inside a rangoli / lotus
   bloom. Built as pure SVG to match the site's hand-drawn design language.
   Used as the hero's ambient background emblem. */
export default function DandiyaMedallion({ className = '', animated = true }) {
  const Bloom = animated ? motion.g : 'g'
  const bloomMotion = animated
    ? {
        style: { transformBox: 'fill-box', transformOrigin: 'center' },
        animate: { scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] },
        transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
      }
    : {}

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="dmRodGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD27A" />
          <stop offset="50%" stopColor="#F4B942" />
          <stop offset="100%" stopColor="#C77E12" />
        </linearGradient>
        <radialGradient id="dmPetalFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(244,185,66,0.18)" />
          <stop offset="100%" stopColor="rgba(244,185,66,0)" />
        </radialGradient>
        <filter id="dmTipGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* breathing rangoli / lotus bloom */}
      <Bloom {...bloomMotion}>
        {/* outer 12 petals */}
        {[...Array(12)].map((_, i) => (
          <path
            key={`o${i}`}
            d="M200 200 C 173 150 178 78 200 44 C 222 78 227 150 200 200 Z"
            fill="url(#dmPetalFill)"
            stroke="#F4B942"
            strokeWidth="1.1"
            transform={`rotate(${i * 30} 200 200)`}
          />
        ))}
        {/* inner 8 petals, offset between the outer ones */}
        {[...Array(8)].map((_, i) => (
          <path
            key={`i${i}`}
            d="M200 200 C 185 170 187 130 200 108 C 213 130 215 170 200 200 Z"
            fill="rgba(247,127,0,0.10)"
            stroke="#FFD27A"
            strokeWidth="0.9"
            opacity="0.8"
            transform={`rotate(${i * 45 + 22.5} 200 200)`}
          />
        ))}
      </Bloom>

      {/* two crossed dandiya sticks */}
      {[35, -35].map((angle, idx) => (
        <g key={idx} transform={`rotate(${angle} 200 200)`}>
          <rect
            x="194"
            y="120"
            width="12"
            height="160"
            rx="6"
            fill="url(#dmRodGold)"
            stroke="#8A5A10"
            strokeWidth="0.5"
          />
          {/* decorative bands */}
          {[150, 200, 250].map((cy) => (
            <rect
              key={cy}
              x="190"
              y={cy - 3}
              width="20"
              height="6"
              rx="2"
              fill="#FF4D8D"
              opacity="0.9"
            />
          ))}
          {/* glowing tips */}
          <circle cx="200" cy="120" r="7" fill="#FFE6A8" filter="url(#dmTipGlow)" />
          <circle cx="200" cy="280" r="7" fill="#FFE6A8" filter="url(#dmTipGlow)" />
        </g>
      ))}

      {/* center ornament where the sticks cross */}
      <circle cx="200" cy="200" r="9" fill="#F4B942" stroke="#FFD27A" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="3.5" fill="#7B1E3A" />
    </svg>
  )
}
