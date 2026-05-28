import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Routes that already have their own primary CTA and would collide with this bar.
const HIDE_ON = ['/register', '/admin', '/contact']

export default function MobileStickyCTA() {
  const [show, setShow] = useState(false)
  const { pathname } = useLocation()
  const hideRoute = HIDE_ON.some((p) => pathname.startsWith(p))

  useEffect(() => {
    if (hideRoute) {
      setShow(false)
      return
    }
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hideRoute])

  if (hideRoute) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
          style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full bg-gradient-to-r from-maroon via-royal to-navy-800 p-2 pl-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] lg:hidden"
        >
          <span className="text-sm font-medium text-cream">Ready to dance?</span>
          <Link
            to="/register"
            className="inline-flex min-h-[40px] items-center rounded-full bg-gradient-to-r from-gold to-marigold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-navy-900"
          >
            Join Now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
