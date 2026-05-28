import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const INSTAGRAM_URL = 'https://www.instagram.com/rangtaal_'

// Reels we want to spotlight — just the shortcodes from the share links.
const FEATURED_REELS = ['DWQMzlrjAzP', 'DWmPhp9kezn', 'DWUVtSIEdo8']

// Real moments from Rangtaal — orientation-aware masonry.
// GR4 is portrait (tall tile), GR6 is wide, the rest are landscape.
const tiles = [
  { id: 1, src: '/GR4.webp', title: 'Under the Lights', moment: 'Garba Night', span: 'lg:col-span-4 lg:row-span-2 h-[440px] lg:h-[620px]' },
  { id: 2, src: '/GR2.webp', title: 'Festival Lights', moment: 'Navratri Night', span: 'lg:col-span-8 h-[300px]' },
  { id: 3, src: '/GR3.webp', title: 'Dressed to Dance', moment: 'Before the Circle', span: 'lg:col-span-4 h-[300px]' },
  { id: 4, src: '/GR6.webp', title: 'The Big Floor', moment: 'Navratri Crowd', span: 'lg:col-span-4 h-[300px]' },
  {
    id: 5,
    title: 'Faces of Rangtaal',
    moment: 'In the Moment',
    span: 'lg:col-span-6 h-[340px]',
    pos: 'center 35%',
    // Multiple people — swipe/scroll through them. Stand-ins for now:
    // drop more face shots into /public and add their paths to this list.
    photos: ['/GR7.webp', '/GR3.webp', '/GR1.webp'],
  },
  { id: 6, src: '/GR5.webp', title: 'On the Field', moment: 'Community Night', span: 'lg:col-span-6 h-[340px]' },
  { id: 7, src: '/GR1-circle.webp', title: 'The Whole Circle', moment: 'The Rangtaal family', span: 'sm:col-span-12 lg:col-span-12 aspect-[1348/766]' },
]

const COUNT = String(tiles.length).padStart(2, '0')

function Tile({ tile, i }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-[22px] ${tile.span} col-span-12 sm:col-span-6 cursor-pointer`}
    >
      <img
        src={tile.src}
        alt={`${tile.title} — ${tile.moment}`}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: tile.pos || 'center' }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {/* grain */}
      <div className="absolute inset-0 mix-blend-overlay bg-noise opacity-20 pointer-events-none" />
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-95" />
      {/* corner index */}
      <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.32em] text-cream/80 backdrop-blur-md">
        {String(tile.id).padStart(2, '0')} / {COUNT}
      </div>
      {/* expand badge on hover */}
      <div className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-cream/30 bg-black/30 text-cream backdrop-blur-md opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* bottom caption */}
      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-[0.62rem] uppercase tracking-[0.32em] text-gold/90">
          {tile.moment}
        </p>
        <p className="display-serif mt-1 text-2xl leading-tight text-cream md:text-3xl">
          {tile.title}
        </p>
      </figcaption>
    </motion.figure>
  )
}

// A tile that holds several photos you can swipe/drag through, with arrows + dots.
function CarouselTile({ tile, i }) {
  const photos = tile.photos
  const n = photos.length
  const [index, setIndex] = useState(0)
  const go = (dir) => setIndex((p) => (p + dir + n) % n)

  return (
    <motion.figure
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-[22px] ${tile.span} col-span-12 sm:col-span-6`}
    >
      {/* sliding photo track — drag/swipe horizontally */}
      <motion.div
        className="absolute inset-0 flex h-full w-full cursor-grab active:cursor-grabbing"
        animate={{ x: `-${index * 100}%` }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          const power = info.offset.x + info.velocity.x * 0.08
          if (power < -70) go(1)
          else if (power > 70) go(-1)
        }}
      >
        {photos.map((src, idx) => (
          <div key={src} className="relative h-full w-full shrink-0 basis-full">
            <img
              src={src}
              alt={`${tile.title} — ${tile.moment} (${idx + 1} of ${n})`}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ objectPosition: tile.pos || 'center' }}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </motion.div>

      {/* grain + overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-noise opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-95" />

      {/* corner index */}
      <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.32em] text-cream/80 backdrop-blur-md">
        {String(tile.id).padStart(2, '0')} / {COUNT}
      </div>

      {/* multi-photo badge */}
      <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-cream/30 bg-black/30 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-cream/85 backdrop-blur-md">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 21h11a2 2 0 0 0 2-2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {n} photos
      </div>

      {/* prev / next arrows (appear on hover) */}
      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-cream/25 bg-black/40 text-cream backdrop-blur-md opacity-0 transition hover:bg-black/65 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-cream/25 bg-black/40 text-cream backdrop-blur-md opacity-0 transition hover:bg-black/65 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* caption */}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-[0.62rem] uppercase tracking-[0.32em] text-gold/90">{tile.moment}</p>
        <p className="display-serif mt-1 text-2xl leading-tight text-cream md:text-3xl">{tile.title}</p>
      </figcaption>

      {/* dot indicators */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 sm:bottom-6 sm:right-6">
        {photos.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to photo ${idx + 1}`}
            onClick={() => setIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === index ? 'w-5 bg-gold' : 'w-2 bg-cream/45 hover:bg-cream/70'
            }`}
          />
        ))}
      </div>
    </motion.figure>
  )
}

// Load Instagram's embed script once, then (re)render any blockquotes on the page.
function useInstagramEmbeds() {
  useEffect(() => {
    const SRC = 'https://www.instagram.com/embed.js'
    const process = () => window.instgrm?.Embeds?.process()
    if (window.instgrm) {
      process()
      return
    }
    let script = document.querySelector(`script[src="${SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SRC
      script.async = true
      document.body.appendChild(script)
    }
    script.addEventListener('load', process, { once: true })
  }, [])
}

// Three spotlighted reels, embedded live, framed to sit on the dark canvas.
function FeaturedReels() {
  useInstagramEmbeds()

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-cream/55">
        <span className="h-px w-10 bg-gold/60" />
        Featured Reels
      </div>
      <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        {FEATURED_REELS.map((code, i) => (
          <motion.div
            key={code}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[22px] border border-cream/10 bg-cream/[0.03] p-2 shadow-xl shadow-black/30 backdrop-blur-sm"
          >
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={`https://www.instagram.com/reel/${code}/`}
              data-instgrm-version="14"
              style={{ margin: 0, width: '100%', minWidth: 0, background: 'transparent', border: 0 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function Gallery() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yParallax = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="gallery" ref={ref} className="relative isolate overflow-hidden py-28">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-[#120726] to-navy-900" />
      <motion.div
        style={{ y: yParallax }}
        className="absolute -top-20 -right-20 -z-10 h-[50vh] w-[60vw] bg-[radial-gradient(ellipse,rgba(247,127,0,0.3),transparent_70%)] blur-3xl"
      />

      <div className="container-wide">
        {/* asymmetrical header */}
        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="section-label">Gallery · The Reel</div>
            <h2 className="display-serif mt-5 text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.95] tracking-tight text-cream">
              Moments that <span className="italic text-cream/40">don’t</span>{' '}
              <span className="gold-text-gradient italic">fit</span>
              <br /> on a phone screen.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:col-start-10">
            <p className="text-sm leading-relaxed text-cream/65">
              A loose, ongoing scrapbook from our workshops, rehearsals, festival
              nights and afterparties. Mostly polaroids. Sometimes accidents. Always honest.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold/90 hover:text-gold"
            >
              View on Instagram
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="mt-16 grid grid-cols-12 gap-4 lg:gap-5">
          {tiles.map((t, i) =>
            t.photos && t.photos.length > 1 ? (
              <CarouselTile key={t.id} tile={t} i={i} />
            ) : (
              <Tile key={t.id} tile={t} i={i} />
            )
          )}
        </div>

        {/* bottom flair */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-cream/10 pt-8">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-cream/55">
            <span className="h-px w-10 bg-gold/60" />
            Captured by the community
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm text-cream/80 hover:text-gold"
          >
            Tag us to be featured <span className="text-gold">→</span>
          </a>
        </div>

        {/* Spotlighted Instagram reels */}
        <FeaturedReels />
      </div>
    </section>
  )
}
