import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './sections/Hero.jsx'
import Workshops from './sections/Workshops.jsx'
import Gallery from './sections/Gallery.jsx'
import Community from './sections/Community.jsx'
import About from './sections/About.jsx'
import Countdown from './sections/Countdown.jsx'
import Registration from './sections/Registration.jsx'
import Footer from './components/Footer.jsx'
import MobileStickyCTA from './components/MobileStickyCTA.jsx'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) {
      document.body.style.overflow = ''
    } else {
      document.body.style.overflow = 'hidden'
    }
  }, [loaded])

  return (
    <>
      <AnimatePresence mode="wait">
        {!loaded && <LoadingScreen key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <div className="relative">
        <Navbar />
        <main className="relative">
          <Hero />
          <Workshops />
          <Gallery />
          <Community />
          <About />
          <Countdown />
          <Registration />
        </main>
        <Footer />
        <MobileStickyCTA />
      </div>
    </>
  )
}
