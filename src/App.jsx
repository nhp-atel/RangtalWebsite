import { useEffect, useState, lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen.jsx'
import Navbar from './components/Navbar.jsx'
import MobileStickyCTA from './components/MobileStickyCTA.jsx'
import Home from './pages/Home.jsx'

// Code-split the secondary pages so the homepage ships less JS up front.
const Workshops = lazy(() => import('./sections/Workshops.jsx'))
const Gallery = lazy(() => import('./sections/Gallery.jsx'))
const About = lazy(() => import('./sections/About.jsx'))
const Community = lazy(() => import('./sections/Community.jsx'))
const Countdown = lazy(() => import('./sections/Countdown.jsx'))
const Registration = lazy(() => import('./sections/Registration.jsx'))
const Contact = lazy(() => import('./sections/Contact.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

function PageFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-cream/15 border-t-gold" />
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden'
  }, [loaded])

  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        {!loaded && <LoadingScreen key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <div className="relative">
        <ScrollToTop />
        <Navbar />
        <main className="relative min-h-screen">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route
                path="/about"
                element={
                  <>
                    <About />
                    <Community />
                  </>
                }
              />
              <Route path="/events" element={<Countdown />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        <MobileStickyCTA />
      </div>
    </HashRouter>
  )
}
