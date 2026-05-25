import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import MobileStickyCTA from './components/MobileStickyCTA.jsx'
import Home from './pages/Home.jsx'
import Workshops from './sections/Workshops.jsx'
import Gallery from './sections/Gallery.jsx'
import Community from './sections/Community.jsx'
import About from './sections/About.jsx'
import Countdown from './sections/Countdown.jsx'
import Registration from './sections/Registration.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
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
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <MobileStickyCTA />
      </div>
    </HashRouter>
  )
}
