import { Link } from 'react-router-dom'

const VALUES = [
    {
        title: 'Tradiție și inovație',
        text: 'Proiecte culturale și educaționale care aduc împreună arta și societatea.'
    },
    {
        title: 'Punți între oameni',
        text: 'Cu rădăcini în Transilvania și deschidere internațională.'
    },
    {
        title: 'Respect pentru natură',
        text: 'Un mod de a crea responsabil, inspirat de ideea de durabilitate.'
    }
]

export default function About() {
    return (
      <section className="about-page">
        <h1 className="page-title">Cine suntem</h1>

        <div className="about-text">
          <p className="about-intro">
            Asociația Culturală Ultra Salix este un spațiu dedicat colaborării și experimentului artistic.
          </p>
          <p>
            Creată din dorința de a sprijini artiștii și comunitățile, asociația dezvoltă proiecte
            culturale și educaționale care aduc împreună tradiția și inovația, arta și societatea.
          </p>
          <p>
            Cu rădăcini în Transilvania și deschidere internațională, Ultra Salix crede în puterea
            culturii de a construi punți între oameni.
          </p>
          <p>
            Cultivăm în același timp respectul pentru natură și un mod de a crea responsabil,
            inspirat de ideea de durabilitate.
          </p>
        </div>

        <ul className="about-values">
          {VALUES.map((v) => (
            <li key={v.title} className="about-value">
              <h2>{v.title}</h2>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>

        <div className="about-cta">
          <p className="about-cta-text">Vrei să colaborăm sau să afli mai multe?</p>
          <Link to="/contact" className="hero-btn hero-btn--primary">
            Contactează-ne →
          </Link>
        </div>
      </section>
    )
  }
