import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const projects = [
    {
        id: 'zoomart',
        title: 'ZOOm Art: animale, obiective și expresie vizuală',
        description: 'Concurs de fotografie dedicat tinerilor între 12-19 ani și vizitatorilor Grădinii zoologice Târgu-Mureș. Fotografiile trebuie realizate în incinta Zoo Târgu-Mureș în perioada 20 septembrie – 20 octombrie 2025. Organizat în parteneriat cu Grădina zoologică Târgu-Mureș și Consiliul Județean Mureș.',
        link: 'https://sites.google.com/ultrasalix.com/zoomart/home',
        linkType: 'external',
        status: 'live'
    },
    {
        id: 'proces-borbala-farkas',
        title: 'Procesul moașei Borbála Farkas',
        description: 'Un capitol tulburător din istoria Târgu-Mureșului, într-o prezentare vizuală și documentară\n\nDemersul readuce în atenție povestea Borbálei Farkas, o femeie judecată și condamnată pentru vrăjitorie la Târgu-Mureș în secolul al XVIII-lea, valorificând această pagină de istorie locală printr-o prezentare digitală accesibilă, care evocă memoria și contextul epocii. Turul oferă o incursiune vizuală și documentară în Târgu-Mureșul secolului al XVIII-lea, bazată pe izvoare de arhivă și ilustrații realizate special pentru acest proiect. Totodată, inițiativa urmărește valorificarea unei pagini de istorie locală prin mijloace digitale contemporane, contribuind la păstrarea și transmiterea memoriei colective. Sunt aduse în discuție teme universale precum condiția femeii, frica și mentalitatea unei comunități aflate la granița dintre rațiune și superstiție. Produsul final este disponibil gratuit în limbile română, maghiară și engleză, oferind acces deschis publicului larg și reflectând caracterul multicultural al orașului Târgu-Mureș.',
        link: '/turvirtual',
        linkType: 'internal',
        status: 'live'
    },
    {
        id: 'epidemix',
        title: 'EPIDEMIX Digital: Tur virtual al istoriilor despre epidemii, corp și vindecare',
        description: 'Un tur virtual interactiv și trilingv (RO, HU, EN), realizat pe baza documentației, cercetării și materialelor expoziției „EPIDEMIX” a Muzeului Județean Mureș.\n\nProiectul explorează, pe trei secțiuni, practicile ritualice și de vindecare din Bazinul Carpatic, istoria epidemiilor și a bolilor, precum și urmele traumelor și afecțiunilor identificate pe oseminte umane. Limbajul vizual și atmosfera expoziției sunt păstrate și adaptate pentru desktop și mobil, iar experiența este completată de un sound design original. Conținutul muzeal și științific este verificat permanent împreună cu Muzeul Județean Mureș. Lansarea publică este programată pentru 11 decembrie 2026, în Sala Multimedia a Muzeului de Istorie și Arheologie din Cetatea Târgu Mureș.',
        status: 'wip'
    },
    {
        id: 'atlas-cultura-alimentara',
        title: 'Cultura alimentară a Târgu-Mureșului: Atlas digital despre hrană, obiceiuri și viață cotidiană',
        description: 'Propune realizarea unui produs cultural digital, interactiv și trilingv, care explorează istoria orașului din 1616 până la mijlocul secolului XX prin relația dintre hrană, schimburi, mediu și viața cotidiană.',
        status: 'wip'
    }
]

const SECTIONS = [
    {
        status: 'live',
        title: 'Proiecte live',
        dividerClass: 'section-divider--live'
    },
    {
        status: 'wip',
        title: 'Proiecte în lucru',
        dividerClass: 'section-divider--wip'
    }
]

function splitColumns(list) {
    const left = list.filter((_, i) => i % 2 === 0)
    const right = list.filter((_, i) => i % 2 === 1)
    return [left, right]
}

export default function Proiecte() {
    const [openId, setOpenId] = useState(null)
    const navigate = useNavigate()

    const toggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id))
    }

    const handleLinkClick = (e, project) => {
        e.stopPropagation() // Prevent card toggle when clicking link
        if (project.linkType === 'internal') {
            navigate(project.link)
        } else if (project.linkType === 'external') {
            window.open(project.link, '_blank', 'noopener,noreferrer')
        }
    }

    const renderCard = (p) => {
        const isOpen = openId === p.id
        const hasLink = !!p.link
        return (
            <div
                key={p.id}
                className={`project-card ${isOpen ? 'open' : ''}`}
                onClick={() => toggle(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggle(p.id)
                    }
                }}
                aria-expanded={isOpen}
            >
                <div className="project-card-head">
                    <div className="project-card-heading">
                        <span className={`status-badge status-badge--${p.status}`}>
                            <span aria-hidden="true">{p.status === 'live' ? '●' : '◐'}</span>
                            {p.status === 'live' ? 'Live' : 'În lucru'}
                        </span>
                        <h3 className="project-title">{p.title}</h3>
                    </div>
                    <span className="chevron" aria-hidden="true">{isOpen ? '–' : '+'}</span>
                </div>

                <div className="project-body" style={{ maxHeight: isOpen ? '3000px' : '0px' }}>
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
        <section className="projects-page">
            {SECTIONS.map((section) => {
                const list = projects.filter((p) => p.status === section.status)
                if (list.length === 0) return null
                const [left, right] = splitColumns(list)
                return (
                    <section key={section.status} className="project-section">
                        <div className="section-heading">
                            <h2>{section.title}</h2>
                        </div>
                        <div className={`section-divider ${section.dividerClass}`} aria-hidden="true" />

                        <div className="grid-2">
                            <div className="grid-column">{left.map(renderCard)}</div>
                            <div className="grid-column">{right.map(renderCard)}</div>
                        </div>
                    </section>
                )
            })}

            <div className="more-teaser">
                <span className="more-teaser-icon" aria-hidden="true">✧</span>
                <div>
                    <p className="more-teaser-title">Și altele...</p>
                    <p className="more-teaser-text">Urmăriți-ne creșterea!</p>
                </div>
            </div>
        </section>
    )
}
