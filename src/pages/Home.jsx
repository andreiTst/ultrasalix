import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const projects = [
    {
        title: 'ZOOm Art: animale, obiective și expresie vizuală',
        description: 'Concurs de fotografie dedicat tinerilor între 12-19 ani și vizitatorilor Grădinii zoologice Târgu-Mureș. Fotografiile trebuie realizate în incinta Zoo Târgu-Mureș în perioada 20 septembrie – 20 octombrie 2025. Organizat în parteneriat cu Grădina zoologică Târgu-Mureș și Consiliul Județean Mureș.',
        link: 'https://sites.google.com/ultrasalix.com/zoomart/home',
        linkType: 'external'
    },
    {
        title: 'Procesul moașei Borbála Farkas',
        description: 'Un capitol tulburător din istoria Târgu-Mureșului, într-o prezentare vizuală și documentară\n\nDemersul readuce în atenție povestea Borbálei Farkas, o femeie judecată și condamnată pentru vrăjitorie la Târgu-Mureș în secolul al XVIII-lea, valorificând această pagină de istorie locală printr-o prezentare digitală accesibilă, care evocă memoria și contextul epocii. Turul oferă o incursiune vizuală și documentară în Târgu-Mureșul secolului al XVIII-lea, bazată pe izvoare de arhivă și ilustrații realizate special pentru acest proiect. Totodată, inițiativa urmărește valorificarea unei pagini de istorie locală prin mijloace digitale contemporane, contribuind la păstrarea și transmiterea memoriei colective. Sunt aduse în discuție teme universale precum condiția femeii, frica și mentalitatea unei comunități aflate la granița dintre rațiune și superstiție. Produsul final este disponibil gratuit în limbile română, maghiară și engleză, oferind acces deschis publicului larg și reflectând caracterul multicultural al orașului Târgu-Mureș.',
        link: '/turvirtual',
        linkType: 'internal'
    },
    {
        title: 'Și altele...',
        description: 'Urmăriți-ne creșterea!'
    }
]

export default function Home() {
    const [openIndex, setOpenIndex] = useState(null)
    const navigate = useNavigate()

    const toggle = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index))
    }

    const handleLinkClick = (e, project) => {
        e.stopPropagation() // Prevent card toggle when clicking link
        if (project.linkType === 'internal') {
            navigate(project.link)
        } else if (project.linkType === 'external') {
            window.open(project.link, '_blank', 'noopener,noreferrer')
        }
    }

    // Split projects into two columns for masonry layout
    const leftColumn = projects.filter((_, i) => i % 2 === 0)
    const rightColumn = projects.filter((_, i) => i % 2 === 1)

    const renderCard = (p, originalIndex) => {
        const isOpen = openIndex === originalIndex
        const hasLink = !!p.link
        return (
            <div
                key={originalIndex}
                className={`project-card ${isOpen ? 'open' : ''}`}
                onClick={() => toggle(originalIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggle(originalIndex)
                    }
                }}
                aria-expanded={isOpen}
            >
                <div className="project-card-head">
                    <h2 className="project-title">{p.title}</h2>
                    <span className="chevron" aria-hidden="true">{isOpen ? '–' : '+'}</span>
                </div>

                <div className="project-body" style={{ maxHeight: isOpen ? '600px' : '0px' }}>
                    <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>
                    {hasLink && (
                        <button
                            className="card-link-btn"
                            onClick={(e) => handleLinkClick(e, p)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation()
                                }
                            }}
                        >
                            Află mai multe →
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <section className="home-wrap">
            <h1 className="page-title">Proiectele noastre</h1>

            <div className="grid-2">
                <div className="grid-column">
                    {leftColumn.map((p, i) => renderCard(p, i * 2))}
                </div>
                <div className="grid-column">
                    {rightColumn.map((p, i) => renderCard(p, i * 2 + 1))}
                </div>
            </div>
        </section>
    )
}
