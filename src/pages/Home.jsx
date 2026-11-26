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

export default function Home({ content }) {
    const isWide = useMediaQuery(WIDE_QUERY)

    return (
        <section className="hero">
            {isWide && <WillowBackground />}

            <div className="hero-content">
                <h1 className="hero-quote-latin">{content.headline}</h1>

                <div className="hero-divider" aria-hidden="true" />

                <p className="hero-lead">
                    {content.home.lead}
                </p>

                <div className="hero-actions">
                    <Link to={content.paths.projects} className="hero-btn hero-btn--primary">
                        {content.home.projects}
                    </Link>
                    <Link to={content.paths.about} className="hero-btn hero-btn--ghost">
                        {content.navigation.about}
                    </Link>
                </div>
            </div>
        </section>
    )
}
