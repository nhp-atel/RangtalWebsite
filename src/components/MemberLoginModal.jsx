import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GOOGLE_CLIENT_ID,
  MEMBER_DRIVE_URL,
  isMemberAccessConfigured,
  isEmailAllowed,
} from '../config/members.js'

function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default function MemberLoginModal({ open, onClose }) {
  const btnRef = useRef(null)
  const [user, setUser] = useState(null) // { email, name, picture }
  const configured = isMemberAccessConfigured()
  const allowed = user && isEmailAllowed(user.email)

  // Render the Google Identity Services button when we need a sign-in.
  useEffect(() => {
    if (!open || !configured || user) return
    let cancelled = false

    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !btnRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => {
          const payload = decodeJwt(resp.credential)
          if (payload?.email) {
            setUser({ email: payload.email, name: payload.name, picture: payload.picture })
          }
        },
      })
      btnRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 280,
      })
    }

    if (window.google?.accounts?.id) {
      init()
      return () => {
        cancelled = true
      }
    }
    let script = document.getElementById('gis-script')
    if (!script) {
      script = document.createElement('script')
      script.id = 'gis-script'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', init)
    return () => {
      cancelled = true
      script.removeEventListener('load', init)
    }
  }, [open, configured, user])

  // Reset to the sign-in screen when the modal is closed.
  useEffect(() => {
    if (!open) setUser(null)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-navy-900/85 p-5 backdrop-blur-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-cream/15 bg-gradient-to-br from-navy-800 via-navy-900 to-[#1a0a1a] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />

            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-cream/15 text-cream/80 transition hover:border-gold/60 hover:text-gold"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative">
              <div className="section-label">Members only</div>

              {/* Not configured yet */}
              {!configured && (
                <div className="mt-5">
                  <h3 className="display-serif text-2xl font-medium text-cream">
                    Member area opens soon.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">
                    We’re setting up secure member access to recordings and photos.
                    If you’ve paid for the month, hang tight — we’ll email you the
                    moment it’s live.
                  </p>
                </div>
              )}

              {/* Signed out → sign-in button */}
              {configured && !user && (
                <div className="mt-5">
                  <h3 className="display-serif text-2xl font-medium text-cream">
                    Welcome back, dancer.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">
                    Sign in with the Google account you registered with to watch
                    recorded sessions and browse class photos.
                  </p>
                  <div ref={btnRef} className="mt-7 flex justify-center" />
                  <p className="mt-5 text-center text-xs text-cream/40">
                    Access is for paid members only.
                  </p>
                </div>
              )}

              {/* Signed in + allowed */}
              {configured && user && allowed && (
                <div className="mt-5">
                  <div className="flex items-center gap-3">
                    {user.picture ? (
                      <img src={user.picture} alt="" className="h-11 w-11 rounded-full ring-1 ring-gold/40" />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/20 text-gold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-cream">{user.name || 'Member'}</p>
                      <p className="text-xs text-cream/55">{user.email}</p>
                    </div>
                  </div>
                  <h3 className="display-serif mt-6 text-2xl font-medium text-cream">
                    You’re in. 🎉
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">
                    Your member drive has every recorded session and the photos
                    from class. Pick up where you left off.
                  </p>
                  <a
                    href={MEMBER_DRIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-6 w-full justify-center"
                  >
                    Open Member Drive
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <button
                    onClick={() => setUser(null)}
                    className="mt-4 w-full text-center text-xs uppercase tracking-[0.3em] text-cream/45 hover:text-cream"
                  >
                    Use another account
                  </button>
                </div>
              )}

              {/* Signed in but NOT on the list */}
              {configured && user && !allowed && (
                <div className="mt-5">
                  <h3 className="display-serif text-2xl font-medium text-cream">
                    We don’t see you on the list yet.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">
                    <span className="text-cream">{user.email}</span> isn’t on our
                    member roll. If you’ve paid for the month, message us and we’ll
                    add you within a day.
                  </p>
                  <button
                    onClick={() => {
                      onClose?.()
                      setTimeout(
                        () => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }),
                        60
                      )
                    }}
                    className="btn-ghost mt-6 w-full justify-center"
                  >
                    Contact us to get added
                  </button>
                  <button
                    onClick={() => setUser(null)}
                    className="mt-4 w-full text-center text-xs uppercase tracking-[0.3em] text-cream/45 hover:text-cream"
                  >
                    Try another account
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
