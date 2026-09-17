import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-name">Asociația Culturală Ultra Salix</span>
        </Link>

        <button
          className="menu-toggle"
          aria-label="Deschide meniul"
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 1H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 7H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 13H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <nav id="site-nav" className={`nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Acasă
          </NavLink>
          <NavLink to="/proiecte" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Proiecte
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Despre noi
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Contact
          </NavLink>
        </nav>

        <Link to="/salix" className="logo-link" onClick={closeMenu} aria-label="Salix">
          <img src="/UltraLogoFinal.png" alt="logo asociație" className="logo" />
        </Link>
      </div>
    </header>
  )
}
