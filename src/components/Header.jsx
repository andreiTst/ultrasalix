import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logo.svg'

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
          ☰
        </button>

        <nav id="site-nav" className={`nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Acasă
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Despre noi
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Contact
          </NavLink>
        </nav>

        <img src={logo} alt="logo asociație" className="logo" />
      </div>
    </header>
  )
}
