import { motion } from 'framer-motion'
import Logo from './Logo.jsx'

const INSTAGRAM_URL = 'https://www.instagram.com/rangtaal_'

const links = {
  Explore: [
    { label: 'Workshops', href: '#workshops' },
    { label: 'Events', href: '#countdown' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Register', href: '#register' },
  ],
  Programs: [
    { label: 'June Batch', href: '#workshops' },
    { label: 'Register', href: '#register' },
    { label: 'Navratri Nights', href: '#countdown' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Our story', href: '#about' },
  ],
  Company: [
    { label: 'Our story', href: '#about' },
    { label: 'Instagram', href: INSTAGRAM_URL },
    { label: 'Contact', href: '#footer' },
    { label: 'Code of conduct', href: '#' },
    { label: 'Refund policy', href: '#' },
  ],
}

const insta = ['#7B1E3A', '#F77F00', '#5A189A', '#FF4D8D', '#F4B942', '#3E1071']

export default function Footer() {
  return (
    <footer id="footer" className="relative isolate overflow-hidden bg-[#06091A] pt-24">
      <div className="absolute -top-32 left-1/2 -z-10 h-[60vh] w-[100vw] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(247,127,0,0.18),transparent_70%)] blur-3xl" />
      <div className="absolute right-0 top-0 -z-10 h-[40vh] w-[40vw] bg-[radial-gradient(circle,rgba(90,24,154,0.3),transparent_70%)] blur-3xl" />

      <div className="container-wide">
        {/* Big editorial CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="grid grid-cols-12 items-end gap-x-8 gap-y-8 border-b border-cream/10 pb-16"
        >
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[0.65rem] uppercase tracking-[0.42em] text-gold/80">
              Stay in the rhythm
            </p>
            <h3 className="display-serif mt-4 text-[clamp(2rem,5vw,4rem)] font-medium leading-[0.95] tracking-tight text-cream">
              The Sunday Note —
              <br />
              <span className="gold-text-gradient italic">one short letter</span> a week,
              <br />no spam, no algorithm.
            </h3>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="group relative rounded-full border border-cream/15 bg-cream/[0.04] p-1.5 transition focus-within:border-gold/60 focus-within:bg-cream/[0.06]"
            >
              <input
                type="email"
                placeholder="your@inbox.com"
                className="w-full bg-transparent pl-5 pr-2 py-3 text-sm text-cream placeholder-cream/40 outline-none"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-gold to-marigold px-5 text-sm font-semibold text-navy-900">
                Subscribe
              </button>
            </form>
            <p className="mt-3 pl-5 text-xs text-cream/45">
              Unsubscribe in one click. We mean it.
            </p>
          </div>
        </motion.div>

        {/* Main footer */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-14 py-16">
          {/* brand col */}
          <div className="col-span-12 lg:col-span-4">
            <Logo size="md" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/65">
              A modern collective devoted to keeping Garba, Raas and Dandiya
              alive — through workshops, festival nights, and a year-round
              community.
            </p>

            {/* socials */}
            <div className="mt-7 flex items-center gap-3">
              {[
                { l: 'Instagram', href: INSTAGRAM_URL, i: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z' },
                { l: 'YouTube', href: '#', i: 'M23 7s0-3-3-3H4S1 4 1 7v10s0 3 3 3h16s3 0 3-3V7Zm-13 9V8l7 4-7 4Z' },
                { l: 'WhatsApp', href: '#', i: 'M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2Zm5 14.2c-.3.7-1.4 1.4-2 1.5-.5.1-1.2.1-1.9-.1-1-.3-2.2-.8-3.6-2.2-1.4-1.4-2-2.7-2.3-3.7-.3-1 0-1.6.4-2 .3-.4.8-.5 1-.5h.6c.2 0 .4 0 .6.5l.7 1.6c.1.2.2.4 0 .7-.1.3-.2.5-.4.7-.2.2-.4.4-.2.7.2.3.8 1.4 1.7 2.2 1.1 1 2 1.3 2.3 1.4.3.2.5.1.7-.1l.9-1c.2-.2.4-.1.6 0l1.5.7c.3.1.5.2.5.4.1.2.1.6-.2 1Z' },
                { l: 'TikTok', href: '#', i: 'M17 2v3a4 4 0 0 0 4 4v3a7 7 0 0 1-4-1.3V16a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V2h3Z' },
              ].map((s) => {
                const external = s.href.startsWith('http')
                return (
                  <a
                    key={s.l}
                    href={s.href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={s.l}
                    className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/80 transition hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.i} />
                    </svg>
                  </a>
                )
              })}
            </div>

          </div>

          {/* link cols */}
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat} className="col-span-6 md:col-span-4 lg:col-span-2">
              <p className="text-[0.6rem] uppercase tracking-[0.42em] text-gold/80">{cat}</p>
              <ul className="mt-5 space-y-3 text-sm text-cream/70">
                {items.map((it) => {
                  const external = it.href.startsWith('http')
                  return (
                    <li key={it.label}>
                      <a
                        href={it.href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="transition hover:text-gold"
                      >
                        {it.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* instagram preview */}
          <div className="col-span-12 lg:col-span-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6rem] uppercase tracking-[0.42em] text-gold/80 transition hover:text-gold"
            >
              @rangtaal_
            </a>
            <div className="mt-5 grid grid-cols-3 gap-1.5">
              {insta.map((c, i) => (
                <a
                  key={i}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-md"
                >
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${c}, #0B132B)` }}
                  />
                  <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
                  <svg className="absolute inset-0 m-auto h-1/2 w-1/2 opacity-70" viewBox="0 0 40 40">
                    <g stroke="#FFF8E7" strokeWidth="2" strokeLinecap="round">
                      <line x1="10" y1="10" x2="30" y2="30" />
                      <line x1="30" y1="10" x2="10" y2="30" />
                    </g>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact bar */}
        <div className="grid grid-cols-12 items-start gap-8 border-t border-cream/10 py-10 text-sm">
          <div className="col-span-12 md:col-span-4">
            <p className="text-[0.6rem] uppercase tracking-[0.32em] text-cream/45">Studio</p>
            <p className="mt-2 leading-relaxed text-cream/80">
              We’ll share the exact location<br />
              once you sign up.
            </p>
          </div>
          <div className="col-span-6 md:col-span-4">
            <p className="text-[0.6rem] uppercase tracking-[0.32em] text-cream/45">Reach</p>
            <p className="mt-2 text-cream/80">
              hello@rangtaal.com<br />
              (630) 555-0150
            </p>
          </div>
          <div className="col-span-6 md:col-span-4">
            <p className="text-[0.6rem] uppercase tracking-[0.32em] text-cream/45">Hours</p>
            <p className="mt-2 text-cream/80">
              Tuesdays · 7:30 – 9:30 PM CT
            </p>
          </div>
        </div>

        {/* Massive wordmark */}
        <div className="relative -mx-6 select-none overflow-hidden border-t border-cream/10 pt-6 md:-mx-10 lg:-mx-16">
          <div className="display-serif whitespace-nowrap text-center text-[clamp(5rem,18vw,16rem)] font-medium leading-none tracking-[-0.04em] text-transparent" style={{ WebkitTextStroke: '1px rgba(255,248,231,0.18)' }}>
            RANGTAAL
          </div>
        </div>

        {/* sub-footer */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-cream/10 py-6 text-xs text-cream/45 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Rangtaal. Made with rhythm in Naperville, IL.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-cream">Privacy</a>
            <a href="#" className="hover:text-cream">Terms</a>
            <a href="#" className="hover:text-cream">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
