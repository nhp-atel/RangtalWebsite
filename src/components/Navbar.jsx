import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo.jsx'
import MemberLoginModal from './MemberLoginModal.jsx'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Workshops', to: '/workshops' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [memberOpen, setMemberOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile menu is open: lock body scroll, close on Esc, focus the
  // close button so keyboard users land inside the overlay.
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

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
            <div className="shrink-0">
              <Logo />
            </div>

            {/* Desktop nav — inline links with hover pill */}
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

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setMemberOpen(true)}
                aria-label="Member login"
                className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/[0.04] px-3 py-2.5 text-[0.78rem] font-medium text-cream/90 transition hover:border-gold/60 hover:bg-gold/10 hover:text-cream lg:px-4"
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

              {/* Hamburger — opens the full-screen menu on mobile only */}
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 bg-cream/[0.04] text-cream/90 transition hover:border-gold/60 hover:bg-gold/10 hover:text-cream md:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col md:hidden"
          >
            {/* brand backdrop + glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-[#0b0a1e] to-navy-900" />
            <div className="pointer-events-none absolute -top-20 right-0 -z-10 h-[45vh] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(90,24,154,0.45),transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-[40vh] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(247,127,0,0.3),transparent_70%)] blur-3xl" />

            {/* top row: logo + close */}
            <div className="container-wide flex items-center justify-between py-5">
              <Logo />
              <button
                ref={closeBtnRef}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 bg-cream/[0.04] text-cream/90 transition hover:border-gold/60 hover:bg-gold/10 hover:text-cream"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* links */}
            <nav className="container-wide flex flex-1 flex-col justify-center gap-1 pb-10">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `display-serif block py-2 text-4xl leading-tight transition ${
                        isActive ? 'text-gold' : 'text-cream/85 hover:text-cream'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + links.length * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col gap-3"
              >
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary justify-center !py-3.5"
                >
                  Register Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    setMemberOpen(true)
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/20 bg-cream/[0.04] py-3 text-sm font-medium text-cream/90 transition hover:border-gold/60 hover:bg-gold/10 hover:text-cream"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Member login
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <MemberLoginModal open={memberOpen} onClose={() => setMemberOpen(false)} />
    </>
  )
}
