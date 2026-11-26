import { Routes, Route, useLocation, matchPath } from 'react-router-dom'
import { useEffect } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Proiecte from './pages/Proiecte.jsx'
import About from './pages/About.jsx'
import TurVirtual from './pages/TurVirtual.jsx'
import Salix from './pages/Salix.jsx'
import siteContent from './siteContent.json'
import './App.css'

const pages = { home: Home, projects: Proiecte, about: About, contact: Contact, intro: Salix }
const localizedRoutes = Object.entries(siteContent).flatMap(([language, { paths }]) =>
  Object.entries(paths).map(([page, path]) => ({ language, page, path })),
)

function ZooMartRedirect() {
  useEffect(() => {
    window.location.href = 'https://sites.google.com/ultrasalix.com/zoomart/home'
  }, [])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const currentRoute = localizedRoutes.find(({ path }) => matchPath(path, pathname))
  const { language = 'ro', page = 'home' } = currentRoute ?? {}
  const content = siteContent[language]
  const fillsViewport = currentRoute && (page === 'home' || page === 'intro')

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <div className={`app${fillsViewport ? ' app-home' : ''}`}>
      <Header content={content} language={language} page={page} />
      <main className={`container${fillsViewport ? ' container-home' : ''}`}>
        <Routes>
          {localizedRoutes.map(({ language, page, path }) => {
            const Page = pages[page]
            return <Route key={path} path={path} element={<Page content={siteContent[language]} />} />
          })}
          <Route path="/turvirtual" element={<TurVirtual />} />
          <Route path="/zoomart" element={<ZooMartRedirect />} />
        </Routes>
      </main>
      <Footer />
      <SpeedInsights />
    </div>
  )
}
