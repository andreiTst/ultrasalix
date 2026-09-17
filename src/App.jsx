import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Proiecte from './pages/Proiecte.jsx'
import About from './pages/About.jsx'
import TurVirtual from './pages/TurVirtual.jsx'
import Salix from './pages/Salix.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import './App.css'

function ZooMartRedirect() {
  useEffect(() => {
    window.location.href = 'https://sites.google.com/ultrasalix.com/zoomart/home'
  }, [])
  return null
}

export default function App() {
  const location = useLocation()
  const fitsViewport = location.pathname === '/' || location.pathname === '/salix'

  return (
    <div className={`app${fitsViewport ? ' app-home' : ''}`}>
      <Header />
      <main className={`container${fitsViewport ? ' container-home' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proiecte" element={<Proiecte />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/turvirtual" element={<TurVirtual />} />
          <Route path="/zoomart" element={<ZooMartRedirect />} />
          <Route path="/salix" element={<Salix />} />
        </Routes>
      </main>
      <Footer />
      <SpeedInsights />
    </div>
  )
}
