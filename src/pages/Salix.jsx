import { Link } from 'react-router-dom'
import WillowBackground from '../components/WillowBackground.jsx'

export default function Salix({ content }) {
  return (
    <section className="salix-page">
      <div className="salix-heading">
        <h1 className="hero-quote-latin">{content.headline}</h1>
        <p className="hero-quote-translation">{content.intro.subtitle}</p>
        <div className="hero-actions salix-actions">
          <Link to={content.paths.about} className="hero-btn hero-btn--ghost">
            {content.navigation.about}
          </Link>
          <Link to={content.paths.projects} className="hero-btn hero-btn--primary">
            {content.intro.projects}
          </Link>
        </div>
      </div>
      <div className="salix-animation">
        <WillowBackground variant="full" />
      </div>
    </section>
  )
}
