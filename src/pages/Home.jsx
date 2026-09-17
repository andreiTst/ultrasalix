import { useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import WillowBackground, { WIDE_QUERY } from '../components/WillowBackground.jsx'

function useMediaQuery(query) {
    return useSyncExternalStore(
        (onChange) => {
            const mql = window.matchMedia(query)
            mql.addEventListener('change', onChange)
            return () => mql.removeEventListener('change', onChange)
        },
        () => window.matchMedia(query).matches
    )
}

export default function Home() {
    const isWide = useMediaQuery(WIDE_QUERY)

    return (
        <section className="hero">
            {isWide && <WillowBackground />}

            <div className="hero-content">
                <p className="hero-quote-latin">„Salix flectitur, non frangitur.”</p>
                <p className="hero-quote-translation">Sălcia se-ndoaie, dar nu se frânge.</p>

                <div className="hero-divider" aria-hidden="true" />

                <p className="hero-lead">
                    Asociația Culturală Ultra Salix cultivă proiecte care leagă tradiția de inovație,
                    comunitatea de artă.
                </p>

                <div className="hero-actions">
                    <Link to="/proiecte" className="hero-btn hero-btn--primary">
                        Vezi proiectele noastre
                    </Link>
                    <Link to="/about" className="hero-btn hero-btn--ghost">
                        Despre noi
                    </Link>
                </div>
            </div>
        </section>
    )
}
