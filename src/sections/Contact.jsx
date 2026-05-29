import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DandiyaMedallion from '../components/DandiyaMedallion.jsx'

const INSTAGRAM_URL = 'https://www.instagram.com/rangtaal_'
const WHATSAPP_URL = 'https://chat.whatsapp.com/GHcpbXvDVKUELszf2NGDoJ?mode=gi_t'
const EMAIL = 'hello@rangtaal.com'
const PHONE_DISPLAY = '1-847-834-9807'
const PHONE_HREF = 'tel:+18478349807'

const socials = [
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  },
  {
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    icon: 'M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2Zm5 14.2c-.3.7-1.4 1.4-2 1.5-.5.1-1.2.1-1.9-.1-1-.3-2.2-.8-3.6-2.2-1.4-1.4-2-2.7-2.3-3.7-.3-1 0-1.6.4-2 .3-.4.8-.5 1-.5h.6c.2 0 .4 0 .6.5l.7 1.6c.1.2.2.4 0 .7-.1.3-.2.5-.4.7-.2.2-.4.4-.2.7.2.3.8 1.4 1.7 2.2 1.1 1 2 1.3 2.3 1.4.3.2.5.1.7-.1l.9-1c.2-.2.4-.1.6 0l1.5.7c.3.1.5.2.5.4.1.2.1.6-.2 1Z',
  },
]

const ease = [0.22, 1, 0.36, 1]

function Card({ children, delay = 0, href }) {
  const cls =
    'group relative flex h-full flex-col gap-4 rounded-[24px] border border-cream/10 bg-cream/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-cream/[0.05]'
  const inner = (
    <>
      <div className="absolute inset-0 -z-10 rounded-[24px] bg-noise opacity-10 mix-blend-overlay" />
      {children}
    </>
  )
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {href ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </motion.div>
  )
}

function CardLabel({ children }) {
  return <p className="text-[0.6rem] uppercase tracking-[0.4em] text-gold/80">{children}</p>
}

const iconWrap =
  'grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold'

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative isolate min-h-screen overflow-hidden pt-36 pb-24 sm:pt-32 lg:pt-40"
    >
      {/* atmospheric backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-[#0b0a1e] to-navy-900" />
        <div className="absolute -top-40 right-0 h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(90,24,154,0.4),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(circle,rgba(247,127,0,0.3),transparent_70%)] blur-3xl" />
        <div className="absolute right-[-12%] top-1/2 hidden aspect-square w-[46%] max-w-[640px] -translate-y-1/2 opacity-[0.16] lg:block">
          <DandiyaMedallion className="h-full w-full" />
        </div>
      </div>

      <div className="container-wide">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="section-label"
          >
            Contact
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="display-serif mt-6 text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[0.95] tracking-tight text-cream"
          >
            Come say <span className="gold-text-gradient italic">hello.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="mt-6 text-lg leading-relaxed text-cream/70"
          >
            Questions about a workshop, Navratri nights, or joining the circle? Reach
            out — we love meeting new dancers, whether you have two left feet or
            twenty years of garba behind you.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:max-w-4xl">
          {/* Email */}
          <Card href={`mailto:${EMAIL}`} delay={0.25}>
            <div className={iconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
                <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <CardLabel>Email</CardLabel>
              <p className="mt-2 display-serif text-xl text-cream transition group-hover:text-gold">
                {EMAIL}
              </p>
            </div>
          </Card>

          {/* Phone */}
          <Card href={PHONE_HREF} delay={0.32}>
            <div className={iconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 18l-1 3a16 16 0 0 1-13-13Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <CardLabel>Call or text</CardLabel>
              <p className="mt-2 display-serif text-xl text-cream transition group-hover:text-gold">
                {PHONE_DISPLAY}
              </p>
            </div>
          </Card>

          {/* Hours */}
          <Card delay={0.39}>
            <div className={iconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <CardLabel>Class hours</CardLabel>
              <p className="mt-2 display-serif text-xl text-cream">Tuesdays</p>
              <p className="mt-1 text-sm text-cream/60">7:30 – 9:30 PM CT</p>
            </div>
          </Card>

          {/* Studio */}
          <Card delay={0.46}>
            <div className={iconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <CardLabel>Studio</CardLabel>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">
                We’ll share the exact location once you sign up.
              </p>
            </div>
          </Card>
        </div>

        {/* socials + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease }}
          className="mt-14 flex flex-col items-start gap-8 border-t border-cream/10 pt-10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-cream/45">Follow along</p>
            <div className="mt-4 flex items-center gap-3">
              {socials.map((s) => {
                const external = s.href.startsWith('http')
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : { onClick: (e) => e.preventDefault() })}
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/80 transition hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.icon} />
                    </svg>
                  </a>
                )
              })}
            </div>
          </div>

          <Link to="/register" className="btn-primary whitespace-nowrap">
            Save your spot
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
