import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import TurVirtual from './pages/TurVirtual.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import './App.css'

function ZooMartRedirect() {
  useEffect(() => {
    window.location.href = 'https://sites.google.com/ultrasalix.com/zoomart/home'
  }, [])
  return null
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/turvirtual" element={<TurVirtual />} />
          <Route path="/zoomart" element={<ZooMartRedirect />} />
        </Routes>
      </main>
      <Footer />
      <SpeedInsights />
    </div>
  )
}
