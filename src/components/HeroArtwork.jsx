import { motion } from 'framer-motion'

/* Cinematic frame for the GarbaIcon illustration.
   The image carries the storytelling — we paint atmosphere around it. */
export default function HeroArtwork() {
  return (
    <div className="relative h-full w-full">
      {/* Painted color backdrop slabs */}
      <div className="absolute inset-0 overflow-hidden rounded-[28px]">
        {/* base wash — matched to the image's deep purple so it bleeds out */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A0A1F] via-[#3E1071] to-[#1A0D3A]" />
        {/* warm sun glow behind the dancers */}
        <motion.div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(244,185,66,0.55) 0%, rgba(247,127,0,0.35) 40%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* lower magenta haze */}
        <div className="absolute -bottom-24 left-0 right-0 h-72 bg-[radial-gradient(ellipse_at_bottom,rgba(255,77,141,0.35),transparent_70%)]" />

        {/* concentric rangoli rings */}
        <svg
          className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 opacity-30"
          viewBox="0 0 400 400"
        >
          <g fill="none" stroke="#F4B942" strokeWidth="0.6">
            {[...Array(7)].map((_, i) => (
              <circle
                key={i}
                cx="200"
                cy="200"
                r={40 + i * 24}
                strokeDasharray="2 6"
              />
            ))}
          </g>
          <g fill="none" stroke="#FFD27A" strokeWidth="0.8" opacity="0.55">
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16
              return (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={200 + Math.cos((angle * Math.PI) / 180) * 200}
                  y2={200 + Math.sin((angle * Math.PI) / 180) * 200}
                />
              )
            })}
          </g>
        </svg>

        {/* faint film grain */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-noise" />
      </div>

      {/* Slow rotating dashed ring around the dancers */}
      <motion.svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="rgba(244,185,66,0.35)"
          strokeWidth="0.8"
          strokeDasharray="3 10"
        />
      </motion.svg>

      {/* Counter-rotating dotted ring */}
      <motion.svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="rgba(255,210,122,0.4)"
          strokeWidth="0.4"
          strokeDasharray="1 6"
        />
      </motion.svg>

      {/* The Garba illustration — floats softly */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src="/GarbaIcon.webp"
          alt="Two dancers performing garba with dandiya sticks"
          className="relative h-[78%] w-[78%] rounded-[20px] object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          draggable="false"
        />
      </motion.div>

      {/* Sparks at the dandiya tips — generic positions over the image */}
      <motion.span
        className="absolute left-[18%] top-[28%] h-3 w-3 rounded-full bg-gold"
        style={{ boxShadow: '0 0 18px #F4B942, 0 0 36px #F77F00' }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.4, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <motion.span
        className="absolute right-[16%] top-[24%] h-3 w-3 rounded-full bg-marigold"
        style={{ boxShadow: '0 0 18px #F77F00, 0 0 36px #FF4D8D' }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.4, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
      />
    </div>
  )
}
