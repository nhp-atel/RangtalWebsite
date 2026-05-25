import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileStickyCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-3 rounded-full bg-gradient-to-r from-maroon via-royal to-navy-800 p-2 pl-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] lg:hidden"
        >
          <span className="text-sm font-medium text-cream">
            Ready to dance?
          </span>
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-gold to-marigold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-navy-900"
          >
            Join Now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
