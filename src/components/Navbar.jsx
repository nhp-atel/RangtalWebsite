import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo.jsx'
import MemberLoginModal from './MemberLoginModal.jsx'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Workshops', to: '/workshops' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [memberOpen, setMemberOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container-wide">
          <div
            className={`relative flex items-center justify-between rounded-full px-4 pl-5 pr-3 transition-all duration-500 ${
              scrolled
                ? 'glass-panel py-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]'
                : 'bg-transparent py-3'
            }`}
          >
            <Logo />

            <nav className="hidden items-center gap-0.5 md:flex">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `group relative rounded-full px-3 py-2 text-sm font-medium transition ${
                      isActive ? 'text-gold' : 'text-cream/80 hover:text-cream'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{l.label}</span>
                      <span
                        className={`absolute inset-0 -z-0 scale-90 rounded-full bg-cream/[0.06] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 ${
                          isActive ? 'scale-100 opacity-100 !bg-gold/10' : 'opacity-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMemberOpen(true)}
                aria-label="Member login"
                className="hidden items-center gap-2 rounded-full border border-cream/20 bg-cream/[0.04] px-3 py-2.5 text-[0.78rem] font-medium text-cream/90 transition hover:border-gold/60 hover:bg-gold/10 hover:text-cream md:inline-flex lg:px-4"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="hidden lg:inline">Members</span>
              </button>
              <Link
                to="/register"
                className="hidden btn-primary !py-2.5 !px-5 !text-[0.78rem] sm:inline-flex"
              >
                Register Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <button
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/90 transition hover:border-gold/60 hover:text-gold md:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-navy-900/85 backdrop-blur-2xl lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-[420px] flex-col bg-gradient-to-b from-navy-800 via-navy-900 to-[#1a0a1a] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="mt-12 flex flex-1 flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between border-b border-cream/10 py-5 text-2xl font-medium transition ${
                          isActive ? 'text-gold' : 'text-cream/90 hover:text-gold'
                        }`
                      }
                    >
                      <span className="display-serif">{l.label}</span>
                      <span className="text-gold/60 transition group-hover:translate-x-1 group-hover:text-gold">
                        →
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary mt-6 w-full justify-center">
                Register Now
              </Link>
              <button
                onClick={() => {
                  setOpen(false)
                  setMemberOpen(true)
                }}
                className="btn-ghost mt-3 w-full justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
                Member Login
              </button>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-cream/40">
                #FeelTheRhythm
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MemberLoginModal open={memberOpen} onClose={() => setMemberOpen(false)} />
    </>
  )
}
