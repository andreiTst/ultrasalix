import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-name">Asociația Culturală Ultra Salix</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Acasă
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Despre noi
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Contact
          </NavLink>
        </nav>

        <img src={logo} alt="logo asociație" className="logo" />
      </div>
    </header>
  )
}
