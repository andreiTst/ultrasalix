import { Link } from 'react-router-dom'

export default function About({ content }) {
  const { title, intro, paragraphs, values, cta, button } = content.about

  return (
    <section className="about-page">
      <h1 className="page-title">{title}</h1>
      <div className="about-text">
        <p className="about-intro">{intro}</p>
        {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <ul className="about-values">
        {values.map(([title, text]) => (
          <li key={title} className="about-value">
            <h2>{title}</h2>
            <p>{text}</p>
          </li>
        ))}
      </ul>
      <div className="about-cta">
        <p className="about-cta-text">{cta}</p>
        <Link to={content.paths.contact} className="hero-btn hero-btn--primary">
          {button} →
        </Link>
      </div>
    </section>
  )
}
