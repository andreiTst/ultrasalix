import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import siteContent from '../siteContent.json'

export default function Header({ content, language, page }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to={content.paths.home} className="brand" onClick={closeMenu}>
          <span className="brand-name">{content.brand}</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={content.menuLabel}
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 1H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 7H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 13H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <nav id="site-nav" className={`nav${menuOpen ? ' open' : ''}`}>
          {Object.entries(content.navigation).map(([page, label]) => (
            <NavLink
              key={page}
              to={content.paths[page]}
              end
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <nav className="language-switcher" aria-label={content.languageLabel}>
          {Object.entries(siteContent).map(([code, { paths }]) => (
            <Link key={code} to={paths[page]} lang={code} hrefLang={code}
              aria-current={code === language ? 'true' : undefined} onClick={closeMenu}>
              {code.toUpperCase()}
            </Link>
          ))}
        </nav>

        <Link to={content.paths.intro} className="logo-link" onClick={closeMenu} aria-label={content.introLabel}>
          <img src="/ultra-salix-icon.svg" alt="" className="logo" width="32" height="32" />
        </Link>
      </div>
    </header>
  )
}
