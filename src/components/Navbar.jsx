import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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

            {/* Mobile nav — links shown directly in a swipeable strip (no hamburger) */}
            <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      isActive ? 'bg-gold/15 text-gold' : 'text-cream/80 hover:text-cream'
                    }`
                  }
                >
                  {l.label}
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
            </div>
          </div>
        </div>
      </motion.header>

      <MemberLoginModal open={memberOpen} onClose={() => setMemberOpen(false)} />
    </>
  )
}
